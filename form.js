console.log("form.js")

const on_load_function = () => {
    fetch("http://localhost:8000/question/all")
    .then(async (response) => {
        let data = await response.json();
        data["questions"].forEach(question=>{
            let option  = document.createElement("option")
            option.innerHTML = question["description"]
            option.value = question["question_id"]
            document.getElementById("exisiting-question").appendChild(option)
        })
    })
}

const get_details = () => {
    question_id = document.getElementById("exisiting-question").value
    if(question_id != "nil"){
        fetch("http://localhost:8000/question?id="+question_id)
            .then(async (response) => {
                let data = await response.json();
                document.getElementById("form-description").value = data["description"]
                document.getElementById("form-options").value = data["options"]
                document.getElementById("form-answer").value = data["answer"]
                update_question_alert()
            })
    }
    if(question_id == "nil"){
        document.getElementById("form-description").value = ""
        document.getElementById("form-options").value = ""
        document.getElementById("form-answer").value = ""
    }
}

const set_details = () => {
    question_json = {}
    missing_info = false
    
    question_json.question_id = "nil"

    if(document.getElementById("exisiting-question").value != "nil"){
        question_json.question_id = document.getElementById("exisiting-question").value
    }

    if(!!document.getElementById("form-description").value){
        question_json.description = document.getElementById("form-description").value
    }else{
        missing_info = true
    }

    if(!!document.getElementById("form-options").value){
        question_json.options = document.getElementById("form-options").value.split(",")
    }else{
        missing_info = true
    }

    if(!!document.getElementById("form-answer").value){
        question_json.answer = document.getElementById("form-answer").value
    }else{
        missing_info = true
    }

    if(!missing_info){
        fetch('http://localhost:8000/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question_json),
            })
            .then(response => response.json())
            .then(data => {
            console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
        
    }else{
        missing_info_alert()
    }

    document.getElementById("exisiting-question").getElementsByTagName("option")[0].selected = "selected"
    document.getElementById("form-description").value = ""
    document.getElementById("form-options").value = ""
    document.getElementById("form-answer").value = ""
}

const print_doc_val = () => {
    console.log(document.getElementById("form-description").value)
    console.log(document.getElementById("form-options").value)
    console.log(document.getElementById("form-answer").value)
}

const missing_info_alert = () => {
    alert("There is missing info!")
}

const update_question_alert = () => {
    alert("Loaded existing question")
}

on_load_function()
document.getElementById("exisiting-question").addEventListener("change", get_details)
document.getElementById("form-submit").addEventListener("click", set_details)