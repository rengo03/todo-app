function addItem(event){
    event.preventDefault();
    let text = document.getElementById('todo-input');
    
    db.collection("todo-items").add({
        text:text.value,
        status: "active"
    })

    text.value="";
} 


function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => {
        
        let items = [];
        let activeItems = [];
        let completedItems = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id:doc.id,
                ...doc.data() //despachetam fiecare obiect si il asociem id-ului initial
            })
            
        })
        snapshot.docs.forEach((doc) => {
            if(doc.data().status == "active"){
                activeItems.push({
                    id:doc.id,
                    ...doc.data()
                })
            }else if(doc.data().status == "completed"){
                completedItems.push({
                    id:doc.id,
                    ...doc.data()
                })
            }
        })
        console.log(completedItems);
        //afisare items-left
        let itemsLeftHTML = `
            <div class="items-left">${activeItems.length} items left</div>
        `;
        document.querySelector(".items-left").innerHTML = itemsLeftHTML;
        //stergerea elementelor cu statusul "completed"
        deleteCompletedItems(completedItems);
        //generam lista cu elementele selectate 
        selectedItem(items,activeItems,completedItems);
    })
}

function deleteCompletedItems(completedItems){
    let deleteButton = document.querySelector(".items-clear");
    deleteButton.addEventListener("click", function deleteCompletedItems(){
        completedItems.forEach((item) => {
            db.collection("todo-items").doc(item.id).delete();
        })
        
        })
}

function selectedItem(items,activeItems,completedItems){
    const itemsCategories = document.querySelectorAll(".items-statuses > span");
    //cautam span-ul care are class="active" pentru a afisa categoria 
    for(let i=0;i<3;i++){
        if(itemsCategories[i].classList.contains("active")=== true){
            selectedCategory(i,items,activeItems,completedItems);
        }
    }
    //cream functionalitatea selectarii categoriei 
    for(let i=0;i<3;i++){
        itemsCategories[i].addEventListener("click", function handleClick(){
            let a=0; let b=0;
            if(i===0){
                a=1;b=2;
            }else if(i===2){
                a=0;b=1;
            }
            else if(i===1){
                a=0;b=2
            }
            itemsCategories[i].classList.add("active");
            itemsCategories[a].classList.remove("active");
            itemsCategories[b].classList.remove("active");
            
            // generam itemele din categoria selectata;
            selectedCategory(i,items,activeItems,completedItems)
        })
    }
}
function selectedCategory(i,items,activeItems,completedItems){
    if(i === 0){
        generateItems(items);
    }else if(i === 1){
        generateItems(activeItems);
    }else if(i === 2){
        generateItems(completedItems);
    }
}

function generateItems(items){

    let itemsHTML = "";
    //adaugam in string-ul itemsHTML html-ul potrivit ce urmeaza sa fie afisat 
    items.forEach((item) => {
        itemsHTML += `
        <div class="todo-item">
            <div class="check">
                <div data-id="${item.id}" class="check-mark ${item.status=="completed" ? "checked" : "" } " >
                    <img src="assets/icon-check.svg" alt="" />
                </div>
            </div>
            <div class="todo-text ${item.status=="completed" ? "checked" : "" } " >${item.text}</div>
        </div> 
      `
    })
    //afisam html-ul prin metoda innerHTML
    document.querySelector(".todo-items").innerHTML = itemsHTML;
    
    createEventLisnteners();
}

function createEventLisnteners(){
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
    // console.log(todoCheckMarks);
    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function(){
            markCompleted(checkMark.dataset.id);
        })
    })
}

function markCompleted(id){ 
    // console.log(id);
    let item = db.collection("todo-items").doc(id);
    item.get().then(function(doc){
        if(doc.exists){
            let status = doc.data().status;
            if(status == "active"){
                item.update({
                    status: "completed"
                })
            }else if(status == "completed"){
                item.update({
                    status: "active"
                })
            }
        }
    }) 
}

getItems();

