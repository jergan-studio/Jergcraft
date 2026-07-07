(function () {
    "use strict";

    console.log("[Jergcraft Core] Engine initialized.");

    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/";
    const COMPUTER_URL = "https://eaglercraft.app/web/";


    function launchGameInstance(url) {

        console.log("[Jergcraft] Loading:", url);

        const menu = document.getElementById("menu-container");
        const frame = document.getElementById("game-frame");


        if (menu) {
            menu.style.display = "none";
        }


        if (frame) {

            frame.src = url;

            frame.style.display = "block";

            frame.onload = () => {

                try {
                    frame.focus();
                } catch (e) {}

            };

        }

    }



    function init() {

        console.log("[Jergcraft] Ready");


        const mobileButton =
            document.getElementById("btn-manual-mobile");


        const computerButton =
            document.getElementById("btn-manual-comp");



        if (mobileButton) {

            mobileButton.onclick = function () {

                launchGameInstance(MOBILE_URL);

            };

        }



        if (computerButton) {

            computerButton.onclick = function () {

                launchGameInstance(COMPUTER_URL);

            };

        }


    }




    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();
