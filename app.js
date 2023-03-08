const todoContainer = document.querySelector(".todo-container");
const titleImg = document.querySelector(".title-img");
const bgDesktop = document.querySelector(".todo-backImage");
const circularElem = document.createElement("button");
const check = document.createElement("img");
const mainText = document.getElementById("main-text");
const todoMain = document.querySelector(".todo-main");
const allTodoList = document.createElement("div");
allTodoList.classList.add("todo-allList");

//输入框确认键
circularElem.classList.add("main-circularBtn");
check.classList.add("check-img");
check.src = "./images/icon-check.svg";
todoMain.appendChild(circularElem);

//输入框事件
function inputClick() {
  if (mainText.value !== "") {
    circularElem.style.background =
      "linear-gradient(145deg, hsl(192, 100%, 67%), hsl(280, 87%, 65%))";
    circularElem.appendChild(check);
  } else {
    circularElem.style.background = "transparent";
    circularElem.removeChild(check);
  }
}

let id = 0;
let todoAllData = loadData();
//创建列表
function createTodoList() {
  id++;
  let data = {
    id: Math.random().toString(31).slice(-10),
    count: id,
    value: mainText.value,
    isCompleted: false,
  };
  todoAllData.push(data);
  updataTodo(todoAllData);
  mainText.value = "";
  setTodoData(loadData()[loadData().length - 1]);
  addFoot();
}

//input点击事件
circularElem.addEventListener("click", () => {
  if (mainText.value) {
    circularElem.style.background = "transparent";
    circularElem.removeChild(check);
    createTodoList();
  }
});

function setTodoData(list) {
  const todoLists = document.createElement("div");
  todoLists.classList.add("todo-list");
  todoLists.setAttribute("count", list.count);

  const checkBtn = document.createElement("button");
  checkBtn.classList.add("list-check");
  todoLists.appendChild(checkBtn);

  const checkElem = document.createElement("img");
  checkElem.classList.add("check-img");
  checkElem.src = "./images/icon-check.svg";
  const listText = document.createElement("li");
  listText.classList.add("list-text");

  listText.innerText = `${list.value}`;
  todoLists.appendChild(listText);

  const deleteImg = document.createElement("img");
  deleteImg.src = "./images/icon-cross.svg";

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(deleteImg);
  deleteBtn.classList.add("list-delete");
  todoLists.appendChild(deleteBtn);

  allTodoList.appendChild(todoLists);

  //已完成事件
  checkBtn.addEventListener("click", (e) => {
    checkBtn.parentElement.style.textDecoration = "line-through";
    checkBtn.appendChild(checkElem);
    checkBtn.style.background =
      "linear-gradient(145deg, hsl(192, 100%, 67%), hsl(280, 87%, 65%))";
    const todoData = localStorage.getItem("todoData"); //获取数据
    const todoDataList = JSON.parse(todoData);
    const count = e.target.parentElement.getAttribute("count");
    for (let i = 0; i < todoDataList.length; i++) {
      if (
        count == todoDataList[i].count &&
        e.target.parentElement.innerText == todoDataList[i].value
      ) {
        todoDataList[i].isCompleted = true;
      }
    }
    updataTodo(todoDataList); //更新数据
    addFoot();
  });

  //删除行事件
  deleteBtn.addEventListener("click", (e) => {
    const todoData = localStorage.getItem("todoData"); //获取数据
    const deleteList = JSON.parse(todoData);
    e.target.parentElement.parentElement.remove();
    for (let i = 0; i < deleteList.length; i++) {
      if (list.id == deleteList[i].id) {
        deleteList.splice(i, 1);
      }
    }
    updataTodo(deleteList); //更新数据
    addFoot();
    const newTodoData = localStorage.getItem("todoData"); //获取数据
    const newList = JSON.parse(newTodoData);
    if (newList !== null) {
      const newActive = newList.filter((deleteElem) => !deleteElem.isCompleted);
      const newCompleted = deleteList.filter(
        (deleteElem) => deleteElem.isCompleted
      );
      if (newActive.length == 0 || newCompleted.length == 0) {
        allElem.onclick(); //返回全部页
      }
    }
  });
  addFoot(); //底部按钮
  allElem.onclick(); //默认全部
}

//底部元素
const footElem = document.createElement("div");
footElem.classList.add("list-foot");

const itemsLeft = document.createElement("li");
footElem.appendChild(itemsLeft);

const middleElem = document.createElement("li");
middleElem.classList.add("foot-middle");

const allElem = document.createElement("li");
allElem.classList.add("foot-all");
allElem.classList.add("active-btn"); //默认
allElem.innerText = "All";
middleElem.appendChild(allElem);

const activeElem = document.createElement("li");
activeElem.classList.add("foot-active");
activeElem.innerText = "Active";
middleElem.appendChild(activeElem);

const completedElem = document.createElement("li");
completedElem.classList.add("foot-completed");
completedElem.innerText = "Completed";
middleElem.appendChild(completedElem);

footElem.appendChild(middleElem);

const clearElem = document.createElement("li");
clearElem.classList.add("foot-clear");
clearElem.innerText = "Clear Completed";
middleElem.appendChild(clearElem);

footElem.appendChild(middleElem);

//添加底部标语
const dragElem = document.createElement("p");
dragElem.classList.add("tail-prompt");
dragElem.innerText = "Drag and drop to reorder list";

todoContainer.appendChild(allTodoList);

//底部按钮事件
allElem.onclick = function (e) {
  const todoList = document.querySelectorAll(".todo-list");
  todoList.forEach((list, index) => {
    list.classList.remove("active-display");
    if (index !== 0) {
      //删除上边角
      let listStyle = list.getAttribute("style");
      if (listStyle == null) {
        return;
      }
      let str = listStyle.replace(
        "border-top-right-radius: 10px; border-top-left-radius: 10px;",
        "border-top-right-radius: 0px; border-top-left-radius: 0px;"
      );
      list.style = str;
    }
  });
  activeBtnStyle("All", todoList);
};

activeElem.addEventListener("click", function (e) {
  const todoList = document.querySelectorAll(".todo-list");
  let firstArr = []; //列表第一排
  todoList.forEach((list) => {
    if (list.style.textDecoration == "line-through") {
      list.classList.add("active-display");
    } else {
      list.classList.remove("active-display");
      firstArr.push(list);
    }
  });
  activeBtnStyle("Active", firstArr);
  addFoot("Active");
});
completedElem.addEventListener("click", (e) => {
  const todoList = document.querySelectorAll(".todo-list");
  let firstArr = []; //列表第一排
  todoList.forEach((list) => {
    if (list.style.textDecoration !== "line-through") {
      list.classList.add("active-display");
    } else {
      list.classList.remove("active-display");
      firstArr.push(list);
    }
  });
  activeBtnStyle("Completed", firstArr);
  addFoot("Completed");
});

//底部按钮值及样式
function addFoot() {
  const todoList = document.querySelectorAll(".todo-list");
  let activeArr = [];
  let completedArr = [];
  todoList.forEach((list) => {
    if (list.style.textDecoration !== "line-through") {
      activeArr.push(list);
    } else {
      completedArr.push(list);
    }
  });
  itemsLeft.innerText = `${activeArr.length}  items left`;
  allTodoList.appendChild(footElem); //添加底部控制按钮
  todoContainer.appendChild(dragElem); //添加底部标语
  if (todoList.length == 0) {
    middleElem.parentElement.remove();
    todoContainer.removeChild(dragElem);
    localStorage.clear(); //清除缓存
  } else {
    todoList[0].style.borderTopLeftRadius = "10px";
    todoList[0].style.borderTopRightRadius = "10px";
  }
  //查询对应数据
  const todoData = localStorage.getItem("todoData");
  if (todoData !== null) {
    let activeData = JSON.parse(todoData).filter(
      (comAll) => !comAll.isCompleted
    );
    if (activeArr.length == 0) {
      activeElem.classList.add("active-events");
    } else if (activeArr.length > 0) {
      activeElem.classList.remove("active-events");
    }
    if (completedArr.length == 0) {
      completedElem.classList.add("active-events");
    } else {
      completedElem.classList.remove("active-events");
    }
  }

  //清除全部完成
  clearElem.addEventListener("click", (e) => {
    if (completedArr.length > 0) {
      completedArr.forEach((clear) => {
        clear.remove();
      });
      const completedAll = localStorage.getItem("todoData");
      if (completedAll == null) {
        return;
      }
      let completedData = JSON.parse(completedAll).filter(
        (comAll) => !comAll.isCompleted
      );
      updataTodo(completedData);
    }

    activeBtnStyle("Clear Completed", []);
    addFoot();
    allElem.onclick(); //清除全部已完成，返回全部列表
  });
}

//底部事件样式
function activeBtnStyle(type, filterArr) {
  const middleLi = document.querySelectorAll(".foot-middle li");
  if (filterArr.length == 0) {
    return;
  }
  filterArr[0].style.borderTopRightRadius = "10px";
  filterArr[0].style.borderTopLeftRadius = "10px";
  middleLi.forEach((li) => {
    if (li.innerText == type) {
      li.className += " active-btn";
    } else if (li.className.includes("active-btn")) {
      li.classList.remove("active-btn");
    }
  });
}

function updataTodo(todoData) {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}

function loadData() {
  const todoAll = localStorage.getItem("todoData");
  if (todoAll !== null) {
    return JSON.parse(todoAll);
  } else {
    return [];
  }
}

//背景图切换
let isShow = false;
titleImg.addEventListener("click", (e) => {
  let element = document.body;
  element.classList.toggle("light-mode");
  if (!isShow) {
    e.target.src = "./images/icon-moon.svg";
    if (window.innerWidth <= 450) {
      bgDesktop.children[0].src = "./images/bg-mobile-light.jpg";
    } else {
      bgDesktop.children[0].src = "./images/bg-desktop-light.jpg";
    }
    isShow = true;
  } else {
    e.target.src = "./images/icon-sun.svg";
    bgDesktop.children[0].src = "./images/bg-desktop-dark.jpg";
    if (window.innerWidth <= 450) {
      bgDesktop.children[0].src = "./images/bg-mobile-dark.jpg";
    }
    isShow = false;
  }
});

window.onresize = function () {
  changeMargin();
};
function changeMargin() {
  if (window.innerWidth <= 450) {
    bgDesktop.children[0].src = "./images/bg-mobile-dark.jpg";
  } else {
    bgDesktop.children[0].src = "./images/bg-desktop-light.jpg";
  }
}
