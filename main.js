console.log("Hello Console!")

let is_responsive = true

const submit_id = () => {
    const question_id = document.getElementById("query-input").value
    if (question_id){
        show_question(question_id)
    }
   document.getElementById("query-input").value = "";
}

const all_questions = () => {
    clear_question()
    fetch("http://localhost:8000/question/all")
    .then(async(response)=>{
        let data = await response.json();
        data["questions"].forEach(question => {
            let q_btn = document.createElement("h3");
            q_btn.innerHTML = question["description"];
            q_btn.setAttribute("question_id", question["question_id"]);
            q_btn.setAttribute("class", "body-all-question");
            q_btn.addEventListener("click", ()=>show_question(q_btn.getAttribute("question_id")));
            document.getElementById("body").appendChild(q_btn)
        })
    })
}

const random_question = () => {
    clear_question()
    
    let description = document.createElement("h2");
    let options = document.createElement("ul");

    description.setAttribute("id", "body-description")
    options.setAttribute("id", "body-options")
    document.getElementById("body").appendChild(description)
    document.getElementById("body").appendChild(options)

    fetch("http://localhost:8000/question/random")
        .then(async (response) => {
            let data = await response.json();
            document.getElementById("body-description").innerHTML = data["description"]
            document.getElementById("body").setAttribute("question_id", data["question_id"])
            data["options"].forEach(option => {
                let li = document.createElement("li");
                li.innerHTML = option;
                li.classList.add("body-option");
                li.addEventListener("click", ()=>{
                    const question_id = document.getElementById("body").getAttribute("question_id")
                    is_correct(question_id, li.innerHTML)
                })
                document.getElementById("body-options").appendChild(li);
            });
        });
}

const show_question = (question_id) => {
    clear_question()
    
    let description = document.createElement("h2");
    let options = document.createElement("ul");

    document.getElementById("body").setAttribute("question_id", question_id)
    description.setAttribute("id", "body-description")
    options.setAttribute("id", "body-options")
    document.getElementById("body").appendChild(description)
    document.getElementById("body").appendChild(options)

    fetch("http://localhost:8000/question?id="+question_id)
        .then(async (response) => {
            let data = await response.json();
            document.getElementById("body-description").innerHTML = data["description"]
            data["options"].forEach(option => {
                let li = document.createElement("li");
                li.innerHTML = option;
                li.classList.add("body-option");
                li.addEventListener("click", ()=>{
                    const question_id = document.getElementById("body").getAttribute("question_id")
                    is_correct(question_id, li.innerHTML)
                })
                document.getElementById("body-options").appendChild(li);
            });
        });
}

const clear_question = () => {
    is_responsive = true
    document.getElementById("body").innerHTML = ""
}

const is_correct = (question_id, option,) =>{
    if(is_responsive){
        fetch("http://localhost:8000/answer?question_id="+question_id+"&answer="+option, {
        method: "POST"
        }).then(async (response) => {
            let data = await response.json();
            console.log(data)
            let options  = document.getElementsByTagName("li")
            console.log(options)
            for(i=0; i<options["length"]; i++){
                options[i].classList.add("body-option-disbled")
                if(options[i].innerHTML ===data["given_answer"]){
                    options[i].classList.add("body-option-wrong");
                }
                if(options[i].innerHTML ===data["correct_answer"]){
                    options[i].classList.add("body-option-correct");
                }
            }
        })
        is_responsive = false
    }
}

document.getElementById("submit_id").addEventListener("click", submit_id)
document.getElementById("submit_all_question").addEventListener("click", all_questions)
document.getElementById("submit_random_question").addEventListener("click", random_question)