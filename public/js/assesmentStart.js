function loadQuizes(topic){
    var req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:3000/getQuizes?topic="+topic, true);
    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200)
        {
            var quizes = req.responseText.split(",");
            var frame = document.getElementById("questionwindow");
            while (frame.children.length > 0) {
                frame.removeChild(frame.childNodes[0]);
            }
            for(var i = 0; i < quizes.length-1; i++){
                var p = document.createElement("p");
                var button = document.createElement("input");
                button.setAttribute("type", "button");
                button.setAttribute("value", quizes[i]);
                button.setAttribute("onclick", "loadQuizes()")
                p.appendChild(button);
                frame.appendChild(p);
            }
        }
    }
    req.send();
}


var req = new XMLHttpRequest();
req.open("GET", "http://127.0.0.1:3000/getTopics", true);
req.onreadystatechange = function(){
    if(req.readyState == 4 && req.status == 200)
    {
        var topics = req.responseText.split(",");
        var frame = document.getElementById("topicselection");
        for(var i = 0; i < topics.length-1; i++){
            var p = document.createElement("p");
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("value", topics[i]);
            button.setAttribute("onclick", "loadQuizes(value)")
            p.appendChild(button);
            frame.appendChild(p);
        }
    }
}
req.send();