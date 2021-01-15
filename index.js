// $(document).ready(function(){
    var tasks = [], count = 1;

    const showNotification =(type,text)=>{
        new Noty({
            type: type,
            layout: 'topRight',
            text: text,
            theme: 'mint',
            timeout:1000
        }).show();      
    }

    const addATask = () => {
        var inputValue = $("#add-task-input").val();
        if(inputValue){
            tasks.push({
                id:count,
                status:'active',
                title:inputValue
            })
            $("#add-task-input").val("");

            $("#tasks-container").append(`<div class="task-tab d-flex" id="task-div-${count}">
            <div class="col-11">
                <input class="task-check checkbox-round form-check-input" id = "task-${count}" data-value=${count} type="checkbox">
                <label class="form-check-label ml-2 mt-1" id="task-text-${count}" for="task-${count}">
                    ${inputValue}
                </label>
            </div>
            <i data-value=${count} class="far fa-times-circle mt-2 cross"></i>
            </div>`);
            addEventListenerToTasks();
            count++;
            showNotification('success',"Task Added")
        }
        else{
            showNotification('error','Add Some task')
        }
        changeTotalTask();
    }

    const deleteATask = (event) => {
        let taskId = parseInt(event.target.attributes['data-value'].value);
        tasks = tasks.filter((task) => {
            return task.id !== taskId
        });
        $(`#task-div-${taskId}`).remove();
        changeTotalTask();
    }


    const addEventListenerToTasks =  () => {
        $('.task-check').click((event) => {
            let taskId = parseInt(event.target.attributes['data-value'].value);
            let isChecked = $(`#task-${taskId}`).is(":checked");
            tasks.map((task , index)=>{
                if(task.id === taskId && isChecked){
                    tasks[index].status = "completed";
                    $(`#task-text-${taskId}`).css('text-decoration', 'line-through');
                    return;
                }
                else if(task.id === taskId && !isChecked){
                    tasks[index].status = "active";
                    $(`#task-text-${taskId}`).css('text-decoration', 'auto');
                    return;
                }
            });
            changeTotalTask();
        });

        $(".cross").click((event) => deleteATask(event));
    }

    
    const changeTotalTask = () =>{
        let  tasksActive = tasks.filter((task)=>{
            return task.status === "active";   
        })
        var tasks_left = tasksActive.length;
        $("#tasks_left").text(tasks_left);
    }


   const render = (clickedBtn) => {
        $("#tasks-container").empty();
        let requiredTasks = tasks.filter((task)=>{
            if(clickedBtn === "all"){
                return tasks;
            }
            else {
                return task.status === clickedBtn; 
            }
        });
        
        requiredTasks.map((task) => {
            let checked;
            task.status === 'completed' ? checked = "checked" : checked = "";
            
            $("#tasks-container").append(`<div class="task-tab d-flex" id="task-div-${task.id}">
            <div class="col-11">
                <input ${checked} class="task-check checkbox-round form-check-input" id = "task-${task.id}" data-value=${task.id} type="checkbox">
                <label class="form-check-label ml-2 mt-1" id="task-text-${task.id}" for="task-${task.id}">
                    ${task.title}
                </label>
            </div>
            <i data-value=${task.id} class="far fa-times-circle mt-2 cross"></i>
            </div>`);
            addEventListenerToTasks();
            if(task.status === 'completed') {
                $(`#task-text-${task.id}`).css('text-decoration', 'line-through');
            }
        });
   }

    const clearCompleted = () => {
        let tasksCompleted = tasks.filter((task)=>{
            return task.status === "completed";
        });
        
        if(tasksCompleted.length <= 0){
            showNotification('error', 'Nothing to delete!');
            return;
        }

        tasksCompleted.map((task)=>{
                $(`#task-div-${task.id}`).remove();   
        });
        tasks = tasks.filter((task)=>{
            return task.status === "active";
        });  
        showNotification('success', 'Completed tasks have been deleted');
   }

    $("#clear-completed-btn").click(() => clearCompleted());

    $("#add-btn").click(() => addATask());

    $("#add-task-input").on('keypress', (event) => {
        if(event.which === 13){
            addATask();
        }
    });

    $("#all-btn").click(() => render("all"));

    $("#active-btn").click(() => render("active"));

    $("#completed-btn").click(() => render("completed"));

// });