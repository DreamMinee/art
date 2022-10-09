<template>
    <header class="header container">
        <div class="header__logo">
            <a href="/" class="header__logo-link">
                <img src="/images/logo.svg" alt="Art" class="header__logo-pic">        
            </a>
        </div>
        <div class="header__date-and-time-mobile">
            <div class="header__start">Start</div>
            <div class="header__date">31 december</div>
        </div>
    </header>
        <main class="main container--mobile">
            <section class="main__header--mobile">
                    <h1 class="main__title--mobile">
                        Outstanding community
                    </h1>
                    <p class="main__subtitle--mobile">
                        for creative people
                    </p>
            </section>
            <section class="registration-form--mobile">
                <div class="users-form--mobile">
                     <div class="registration-form__label">
                        <p><span>Incredible benefits</span> for early students and teachers</p>
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
                    <button class="button__submit" type="button">
                        Get a benefit <img src="/images/present-icon.svg" alt="Present-icon">
                    </button> 
                </div> 
                <div class="counter--mobile">
                    <div class="counter__number">
                        Places left 986! 
                    </div>
                </div>
            </section>
        </main>

        <footer class="footer--mobile">
            <div class="footer__cards--mobile">
                <div class="footer__card--mobile footer__card-1--mobile">
                    <img src="/images/redcard-mobile-pic.svg" alt="Red">             
                </div> 
                <div class="footer__card--mobile footer__card-2--mobile">
                    <img src="/images/digital-mobile-pic.svg" alt="Digital"> 
                </div>
                <div class="footer__card--mobile footer__card-3--mobile">
                    <img src="/images/card3D-mobile-pic.svg" alt="3D"> 
                </div>
                <div class="footer__card--mobile footer__card-4--mobile">
                    <img src="/images/painting-mobile-pic.svg" alt="Painting"> 
                </div>
                <div class="footer__card--mobile footer__card-5--mobile">
                    <img src="/images/art-mobile-pic.svg" alt="Art">
                </div>
                <div class="footer__card--mobile footer__card-6--mobile">
                    <img src="/images/sculpture-mobile-pic.svg" alt="Sculpture"> 
                </div>
                <div class="footer__card--mobile footer__card-7--mobile">
                    <img src="/images/craft-mobile-pic.svg" alt="Craft"> 
                </div>
                <div class="footer__card--mobile footer__card-8--mobile">
                    <img src="/images/darkcard-mobile-pic.svg" alt="Dark"> 
                </div>
            </div>
        </footer> 
        <video ref="bgVideo" autoplay muted id="myVideo-mobile">
            
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
    padding: 0;

}
*, *::before, *::after {
    box-sizing: inherit;

}
.container--mobile {
    max-width: 100%;
    margin: auto 40px;
}
.header {
    display: flex;
    padding: 32px 0;
    justify-content: space-between;
    align-items: center;
    
}

.header__date-and-time-mobile {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    font-family: "Onest Regular", "Arial", "Helvetica", sans-serif; 
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 32px;
    color: #fff;
}

.main__header--mobile {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.main__title--mobile {
    width: 80%;
    font-weight: 500;
    font-size: 40px;
    line-height: 52px;
    color: #fff;
    margin-bottom: 0;
    text-align: center;
}

.main__subtitle--mobile {
    font-size: 16px;
    line-height: 32px;
    color: #fff;
    text-align: center;
    width: 80%;
    font-weight: 400;
}
.registration-form--mobile {
    display: flex;
    justify-content: left;
    background-color: transparent;
    flex-direction: column;
}
.registration-form__label p {
    width: 100%;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    
}
.registration-form__label span {
    color: #76B525;
}
.users-form--mobile {
    background:rgba(18, 18, 18, 0.7);
    height: 284px;
    border-radius: 25px 25px 0 0;
    padding: 20px;
}

.counter--mobile {
    background: #121212;
    display: flex;
    height: 60px;
    color: #fff;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: "Onest Regular", "Arial", sans-serif;
    flex-direction: column;
    border-radius: 0px 0px 24px 24px;
    
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
.users-form--mobile button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-top: 10px;
    margin-bottom: 15px;
    width: 100%;
    height: 56px;
    border-radius: 8px;
    background-color: #76B525;
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
    border: 0;
    cursor: pointer;
}
.users-form button:hover {
    background-color:#629223 ;
}
.footer--mobile {
    display: flex;
    justify-content: flex-end;
    align-items: center;


}
.footer__cards--mobile {
    position: absolute;
    bottom: 0px;
    display: flex;
    width: 100%;
    align-items: flex-end;
    justify-content: flex-start;
   
}
.footer__card--mobile {
    position: absolute;
    bottom: 0;
    display: flex;
    margin-left: 0px;
    justify-content: flex-start;
    align-items: flex-end;
}
.footer__card-1--mobile {
    left: -10px;
}
.footer__card-2--mobile {
    left: -10px ;
    z-index: 100;
}
.footer__card-3--mobile {
    left: 10px;
    z-index: 80;   
}
.footer__card-4--mobile {
    left: 75px;
    z-index: 90;
}
.footer__card-5--mobile {
    right: 80px;
    z-index: 70;
}
.footer__card-6--mobile {
    right: -5px;
    z-index: 100;
}
.footer__card-7--mobile {
    right: -5px;
    z-index: 80;
}
.footer__card-8--mobile {
    right: -10px;
    z-index: -1;
}

.footer__card--mobile:first-child{
    margin-left: 0;
}

#myVideo-mobile {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    z-index: -100;
}

</style>