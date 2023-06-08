        // how to play button for showing instructions 
        function showInstr() {
            var x = document.getElementById("instructions");
            if (x.style.display === "none") {
            x.style.display = "block";
            } else {
            x.style.display = "none";
            }
        }
        
        // main canvas 
        let canvas = document.getElementById("bouncing-dvd");
        let ctx = canvas.getContext("2d");
        let logoColor;

        // dvd animation properties
        let dvd = {
            x: 760,
            y: 500,
            xspeed: 3.5,
            yspeed: 3.5,
        };

        // dvd image
        let dvdImg = new Image();
        dvdImg.src = 'assets/dvd.png';

        //audio
        let cornerAud = document.getElementById('corner-hit');
        let edgeAud = document.getElementById('edge-hit');
        let scoreAud = document.getElementById('score-up');
        let bgmAud = document.getElementById('bgm');
        bgmAud.loop = true;

        // corners
        let topLeft;
        let topMiddle;
        let topRight;

        let middleLeft;
        let middleRight;

        let botLeft;
        let botMiddle;
        let botRight;

        let mouseBoxSize = {
            width: 100,
            height: 100
        }


        function main() {        
            dvdImg.onload = function(){ 
                ctx.drawImage(dvdImg,dvd.x,dvd.y);
            }

            // detects mouse click
            //canvas.addEventListener("click", onClick, false);
            canvas.addEventListener('click', (e) => {
                const canvasPos = canvas.getBoundingClientRect();
                const mousePos = {
                    x: Math.round(e.clientX - canvasPos.left),
                    y: Math.round(e.clientY - canvasPos.top)
                }

                onClick(e, mousePos);
                });
            window.requestAnimationFrame(animate);
        }



        // change dvd direction on mouse click
        function onClick(e, mousePos) {
            // mouse hitbox
            let mouseBox = {
                x: (mousePos.x - mouseBoxSize.width / 2),
                y: (mousePos.y - mouseBoxSize.height / 2)
            }

            getDVDCorners();
            // drawing boxes on the dvd logo for each hit point
            // Top Left Hit
            if (isInside(topLeft, mouseBox)){
                if (dvd.yspeed < 0) { dvd.yspeed *= -1;  }
                if (dvd.xspeed < 0) { dvd.xspeed *= -1; }
            }
            // Top Middle Hit
            if (isInside(topMiddle, mouseBox)){
                if (dvd.yspeed < 0) { dvd.yspeed *= -1; }
            }
            // Top Right Hit
            if (isInside(topRight, mouseBox)){
                if (dvd.yspeed < 0) { dvd.yspeed *= -1; }
                if (dvd.xspeed > 0) {dvd.xspeed *= -1; }
            }
            // Mid Left Hit
            if (isInside(middleLeft, mouseBox)){
                if (dvd.xspeed < 0) { dvd.xspeed *= -1; }
            }
            // Mid Right Hit
            if (isInside(middleRight, mouseBox)){
                if (dvd.xspeed > 0) {dvd.xspeed *= -1; }
            }
            // Bottom Left Hit
            if (isInside(botLeft, mouseBox)){
                if (dvd.yspeed > 0) { dvd.yspeed *= -1; }
                if (dvd.xspeed < 0) { dvd.xspeed *= -1; }
            }
            // Bottom Mid Hit
            if (isInside(botMiddle, mouseBox)){
                if (dvd.yspeed > 0) { dvd.yspeed *= -1; }
            }
            // Bottom Right Hit
            if (isInside(botRight, mouseBox)){
                if (dvd.yspeed > 0) { dvd.yspeed *= -1; }
                if (dvd.xspeed > 0) {dvd.xspeed *= -1; }
            }
        }


        // store dvd corner
        function getDVDCorners(){
            topLeft = {x: dvd.x,
                y: dvd.y}
            topMiddle = {x: (dvd.x + (dvdImg.width / 2)),
                y: dvd.y}
            topRight = {x: (dvd.x + dvdImg.width),
                y: dvd.y}

            middleLeft = {x: dvd.x,
                y: (dvd.y + dvdImg.height / 2)}

            middleRight = {x: (dvd.x + dvdImg.width),
                y: (dvd.y + dvdImg.height / 2)}

            botLeft = {x: dvd.x, 
                y: (dvd.y + dvdImg.height)}

            botMiddle = {x: (dvd.x + dvdImg.width / 2),
                y: (dvd.y + dvdImg.height)
            }
            botRight = {x: (dvd.x + dvdImg.width),
                y: (dvd.y + dvdImg.height)}
        }

        // determines if a set of coords is inside the dvd
        function isInside(dvdCorner,  mouseBox){

            return (dvdCorner.x >=  mouseBox.x  
            && dvdCorner.x <= (mouseBox.x + mouseBoxSize.width)
            && dvdCorner.y >=  mouseBox.y 
            && dvdCorner.y <= (mouseBox.y +  mouseBoxSize.height))
            ? true : false;
        }

        // animate logo                     
        function animate() {
            // clear canvas
            ctx.clearRect(0,0,canvas.width,canvas.height);
        
            // draw logo background           
            ctx.fillStyle = logoColor;
            ctx.fillRect(dvd.x, dvd.y, dvdImg.width, dvdImg.height);
            // draw logo
            ctx.drawImage(dvdImg,dvd.x,dvd.y);
        
            // animate dvd
            dvd.x+=dvd.xspeed;
            dvd.y+=dvd.yspeed;
            window.requestAnimationFrame(animate);
            checkHitBox();
        }
        
        // change direction and bg color when logo hits an edge/corner
        function checkHitBox(){
            // hitting edges
            if(dvd.x+dvdImg.width >= canvas.width || dvd.x <= 0){
                dvd.xspeed *= -1;
                changeColor();
                edgeAud.play();                
            }
            if(dvd.y+dvdImg.height >= canvas.height || dvd.y <= 0){
                dvd.yspeed *= -1;
                changeColor();
                edgeAud.play();                         
            }
            
            // hitting corners
            getDVDCorners();
            (topLeft.x >= 0 && topLeft.x <= 15 && topLeft.y >= 0 && topLeft.y <= 15) ? hitCorner() : undefined;
            (topRight.x >= canvas.width - 15 && topRight.y <= 15) ? hitCorner() : undefined;
            (botLeft.x <= 15 && botLeft.y >= canvas.height - 15) ? hitCorner() : undefined;
            (botRight.x >= canvas.width - 15 && botRight.y >= canvas.height - 15) ? hitCorner() : undefined;
        } 

        // plays sound and logs the corner hit
        function hitCorner() {
            cornerAud.play();
            console.log('corner hit');
        }

        // change logo background color to random
        function changeColor(){
            r = Math.random() * (254 - 0) + 0;
            g = Math.random() * (254 - 0) + 0;
            b = Math.random() * (254 - 0) + 0;

            logoColor = 'rgb('+r+','+g+', '+b+')';
        }

        setTimeout(() => {
            main();
        }, 300)