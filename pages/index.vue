<template>
    <header class="header container">
        <div class="header__logo">
            <a href="/" class="header__logo-link">
                <img src="/images/logo.svg" alt="Art" class="header__logo-pic">        
            </a>
        </div>
        <div class="header__date-and-time">
            <img src="/images/clock-icon.svg" alt="Clock">
            <div class="header__date-and-time--start">Start</div>
            <div>31 december 2022</div>
            <div>3m 4d 02:08:54</div>
        </div>
    </header>
        <main class="main container">
            <section class="intro">
                    <h1 class="intro__title line-text anim-typewriter">
                        Inspired Teachers
                    </h1>
                    <p class="intro__subtitle">
                        for creative people
                    </p>
            </section>
            <section class="registration-form">
                <div class="users-form">
                     <div class="registration-form__label">
                        Incredible benefits for early students and teachers
                    </div>   
                <div class="tabs-wrapper">
                    <div class="tab-student active">
                            I'am student
                    </div>
                <div class="tab-teacher">
                            I'am teacher 
                    </div>          
                    </div>     
                <div class="content-wrapper">
                        <input type="email" placeholder="Email">        
                    </div> 
                <button type="button">
                        Get a benefit <img src="/images/present-icon.svg" alt="Present-icon">
                </button> 
                    </div> 
                <div class="counter">
                    <div class="counter__number">
                        986 
                    </div>
                    <div class="counter__label">
                        Places left
                    </div>   
                </div>
            </section>
        </main>
            <footer class="footer">
                <div class="footer__cards">
                    <div class="footer__card">
                        <img class="photograthy-pic" src="/images/photography-pic.svg" alt="Photography">            
                </div>    
                    <div class="footer__card">
                        <img class="art-pic" src="/images/art-pic.svg" alt="Art">
                </div>
                    <div class="footer__card">
                        <img class="drawing-pic" src="/images/drawing-pic.svg" alt="Drawing">
                </div> 
                    <div class="footer__card">
                        <img class="digital-pic" src="/images/digital-pic.svg" alt="Digital">
                        </div> 
                <div class="footer__card">
                        <img class="painting-pic" src="/images/painting-pic.svg" alt="Painting">
                </div> 
                    <div class="footer__card">
                        <img class="design-pic" src="/images/design-pic.svg" alt="Design">
                </div> 
                    <div class="footer__card">
                        <img class="craft-pic" src="/images/craft-pic.svg" alt="Craft">
                </div> 
                    <div class="footer__card">
                        <img class="sculpture-pic" src="/images/sculpture-pic.svg" alt="Sculpture">
                </div>
                    <div class="footer__card">
                        <img class="card3D-pic" src="/images/card3D-pic.svg" alt="3D">
                </div>
                    <div class="footer__card">
                        <img class="illustration-pic" src="/images/illustration-pic.svg" alt="Illustration">
                    </div>
                </div>
            </footer>
                    <video ref="bgVideo" autoplay muted id="myVideo">
                    </video>
</template>
<script>
import { ref, onMounted } from "#imports"
export default {
    setup() {
        let position = 0;
        let play = 0;
        let nextVideo = () => {
            position++;
            if(position >= playlist.length) {
                position = 0;
            }
            bgVideo.value.src = playlist[position];
            bgVideo.value.load();
            bgVideo.value.play();
        };

        let playlist = ["/video/1.mp4",
                    "/video/2.mp4",
                    "/video/3.mp4",
                    "/video/4.mp4",
                    "/video/5.mp4",
                    "/video/6.mp4",
                    "/video/7.mp4",
                    "/video/8.mp4",
                    "/video/9.mp4"];
        let bgVideo = ref();

        onMounted(() => {
            setTimeout(() => {
                bgVideo.value.addEventListener("ended", nextVideo, false);
                bgVideo.value.src = playlist[position];
                bgVideo.value.load();
                bgVideo.value.play();
            }, 1000);
        })

        return {
            bgVideo
        }
    }
}

</script>
<style>
@font-face {
    font-family: "Onest Regular";
    src: local("Onest Regular"),
         url("/fonts/OnestRegular1602-hint.woff");
    font-weight: 400;
    font-display: swap;
    font-style: normal;
}
@font-face {
    font-family: "Onest Medium";
    src: local("Onest Medium"),
         url("/fonts/OnestMedium1602-hint.woff");
    font-weight: 400;
    font-display: swap;
}
@font-face {
    font-family: "Onest Bold";
    src: local("Onest Bold"),
         url("/fonts/OnestBold1602-hint.woff");
    font-weight: 400;
    font-display: swap;
}
@font-face {
    font-family: "Onest Thin";
    src: local("Onest Thin"),
         url("/fonts/OnestThin1602-hint.woff");
    font-weight: 400;
    font-display: swap;
}
body {
    background-color:#999;
    font-family: "Onest Regular", "Arial", sans-serif;
}
*, *::before, *::after {
    box-sizing: inherit;
}
.container {
    max-width: 1920px;
    margin: auto 296px;
}
.header {
    display: flex;
    padding: 32px 0;
    justify-content: space-between;
    align-items: center;   
}
.header__date-and-time {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    font-family: "Onest Regular", "Arial", "Helvetica", sans-serif; 
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 32px;
    color: #fff;
}
.header__date-and-time--start {
    font-weight: 500;
}
.intro {
    min-width: 696px;
}
.intro__title {
    width: 100%;
    font-weight: 500;
    font-size: 80px;
    line-height: 104px;
    color: #fff;
    margin-bottom: 0;
    margin-top: 40px;
}
.intro__subtitle {
    font-size: 24px;
    line-height: 32px;
    color: #fff;
    margin-top: -10px;
}
.registration-form {
    display: grid;
    grid-template-columns: 473px 155px;
    background-color: transparent;
    grid-template-rows: 1fr;
}
.registration-form__label {
    font-weight: 500;
    font-size: 16px;
    line-height: 26px;
}
.users-form {
    background:
    radial-gradient(circle at 100% 100%, rgba(0,0,0,0) 10px, rgba(18, 18, 18, 0.7) 8px),
    radial-gradient(circle at 100% 0%, rgba(0,0,0,0) 10px, rgba(18, 18, 18, 0.7) 8px);
    background-position: bottom right, top right;
    background-size: 150% 50%;
    background-repeat: no-repeat;
    height: 284px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    padding: 20px;
} 
.counter-wrapper {
    border-radius: 25px;
}
.counter {
    height: 100%;
    background:
        radial-gradient(circle at 0 100%, rgba(0,0,0,0) 10px, #76B525 8px),
        radial-gradient(circle at 0 0, rgba(0,0,0,0) 10px, #76B525 8px);
    background-position: bottom left, top left;
    background-size: 150% 50%;
    background-repeat: no-repeat;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 56px;
    line-height: 64px;
    font-family: "Onest Regular";
    flex-direction: column;
}

.counter__label {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.tabs-wrapper {
    width: calc(100% - 8px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid #414141;
    padding: 2px;
    border-radius: 6px;
    height: 40px;
}

.tab-student {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    height: 100%;
    width: 50%;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

}
.tab-teacher {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    height: 100%;
    width: 50%;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;


}
.active {
    background: #76B525;
}
.registration-form__label {
    font-weight: 500;
    font-size: 16px;
    line-height: 26px;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    
}
.content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    
    
}
.content-wrapper input {
    background-color: transparent;
    border: 2px solid #414141;
    width: 100%;
    height: 56px;
    margin-top: 10px ;
    margin-bottom: 15px;
    padding: 0 15px;
    border-radius: 8px;
    color: #979797;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    font-family: "Onest Regular", "Arial", "Helvetica", sans-serif; 
}
.content-wrapper input:focus {
    outline: none !important;
    border-color: #414141;
}
.users-form button {
    display: flex;
    border-radius: 8px;
    width: calc(100% - 32px);
    height: 48px;
    background-color: #76B525;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 8px;
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
    border: 0;
    cursor: pointer;
}
.users-form button:hover {
    background-color:#629223 ;
}
.footer {
    display: flex;
    flex-wrap: nowrap;
    background-color: transparent;
    justify-content: center;
    padding: 0;
    align-content: flex-end;
}
.footer__cards {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    position: absolute;
    bottom: 0px;
    width: 100%;
}
.footer__card {
    display: flex;
    margin-left: 0px;
    justify-content: space-between;
    bottom: 0;
    max-width: 100%;
}
.footer__card:first-child{
    margin-left: 0;
}
.photograthy-pic {
    z-index: 120;
    max-width: 100%;
    margin-top: 60%;
   
}
.art-pic {
    z-index: 110;
    max-width: 130%;
    margin-left: -50%;
    
}
.drawing-pic {
    z-index: 110;
    max-width: 100%;
    margin-top: 30%;
    margin-left: -60%;
}
.digital-pic {
    z-index: 110;
    max-width: 110%;
    margin-left: -90%;
    margin-top: 50%;
   
}
.painting-pic {
    z-index: 110;
    max-width: 160%;
    margin-top: 30%;
    margin-left: -100%;
    
}
.design-pic {
    z-index: 110;
    max-width: 130%;
    margin-top: 60%;
    margin-left: -50%;
    
}
.craft-pic {
    z-index: 0;
    max-width: 150%;
    margin-top: 0%;
    margin-left: -48%;
    
}
.sculpture-pic {
    z-index: 100;
    max-width: 100%;
    margin-top: 60%;
    margin-left: -20%;
    
}
.card3D-pic {
    z-index: 90;
    max-width: 150%;
    margin-top: 10%;
    margin-left: -30%;
    
}
.illustration-pic {
    z-index: 100;
    max-width: 100%;
    margin-top: 50%
    
}
#myVideo {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: -100;
}
.anim-typewriter{
animation: typewriter 3s steps(44) 1s 1 normal both,
blinkTextCursor 500ms steps(44) infinite normal;
}
@keyframes typewriter{
from{width: 0;}
to{width: 670px;}
}
@keyframes blinkTextCursor{
from{border-right-color: rgba(255,255,255,.75);}
to{border-right-color: transparent;}
}
.line-text {
    position: relative; 
    border-right: 4px solid rgba(255,255,255,.75);
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    transform: translateY(-50%);    
}
</style>