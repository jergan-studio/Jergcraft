(function () {
    "use strict";

    console.log("[Jergcraft Core] Engine initialized.");

    const MOBILE_URL = "https://irv77.github.io/EaglerPocketMobile/demo/";
    const COMPUTER_URL = "https://eaglercraft.app/web/";



    function injectServerIntoStorage(name, address) {

        try {

            let serverList = localStorage.getItem("eaglercraft_servers");
            let parsedList = [];

            if (serverList) {
                try {
                    parsedList = JSON.parse(serverList);
                } catch {
                    parsedList = [];
                }
            }


            parsedList = parsedList.filter(
                server => server.addr !== address
            );


            parsedList.unshift({
                name:name,
                addr:address,
                hide:false
            });


            localStorage.setItem(
                "eaglercraft_servers",
                JSON.stringify(parsedList)
            );


            return true;


        } catch(error) {

            console.warn(
                "[JergServer] Failed saving server."
            );

            return false;
        }

    }




    function launchGameInstance(url) {

        const menu =
        document.getElementById("menu-container");

        const frame =
        document.getElementById("game-frame");



        if(menu)
            menu.style.display="none";


        if(frame){

            frame.src=url;
            frame.style.display="block";


            frame.onload=function(){

                try {

                    frame.contentWindow.localStorage.setItem(
                        "eaglercraft_servers",
                        localStorage.getItem(
                            "eaglercraft_servers"
                        )
                    );

                } catch(e){}


                frame.focus();

            };

        }

    }







    function init(){

        console.log("[Jergcraft Core] Loaded.");



        const mobile =
        document.getElementById("btn-manual-mobile");


        const computer =
        document.getElementById("btn-manual-comp");



        if(mobile){

            mobile.onclick=function(){

                launchGameInstance(
                    MOBILE_URL
                );

            };

        }



        if(computer){

            computer.onclick=function(){

                launchGameInstance(
                    COMPUTER_URL
                );

            };

        }






        const open =
        document.getElementById(
            "btn-open-jergservers"
        );


        const modal =
        document.getElementById(
            "jerg-dashboard-modal"
        );


        const close =
        document.getElementById(
            "btn-dashboard-close"
        );


        const submit =
        document.getElementById(
            "btn-dashboard-submit"
        );



        const nameInput =
        document.getElementById(
            "jerg-input-name"
        );


        const urlInput =
        document.getElementById(
            "jerg-input-url"
        );





        if(open && modal){

            open.onclick=function(){

                nameInput.value="";
                urlInput.value="https://";

                modal.style.display="block";

                nameInput.focus();

            };

        }




        if(close && modal){

            close.onclick=function(){

                modal.style.display="none";

            };

        }






        if(submit){

            submit.onclick=function(){


                let name =
                nameInput.value.trim()
                ||
                "JergServer";



                let url =
                urlInput.value.trim();




                if(url.startsWith("https://")){

                    url =
                    url.replace(
                        "https://",
                        "wss://"
                    );

                }
                else if(url.startsWith("http://")){

                    url =
                    url.replace(
                        "http://",
                        "ws://"
                    );

                }




                if(
                    !url.startsWith("ws://")
                    &&
                    !url.startsWith("wss://")
                ){

                    alert(
                        "Use https:// or wss:// server address"
                    );

                    return;

                }




                if(
                    injectServerIntoStorage(
                        name,
                        url
                    )
                ){

                    alert(
                        "Successfully added server: "
                        + name
                    );


                    modal.style.display="none";


                }
                else {

                    alert(
                        "Failed to save server"
                    );

                }


            };

        }



    }





    if(
        document.readyState==="loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }
    else {

        init();

    }


})();
