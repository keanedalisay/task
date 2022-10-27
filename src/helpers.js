export function delegateEvent(elem, event, slctr, func) {
  elem.addEventListener(event, (e) => {
    if (e.target.matches(slctr)) func(e.target);
  });
  return;
}

export function insertHTML(elem, childHtml) {
  elem.insertAdjacentHTML("afterbegin", childHtml);
  return;
}

export function insertElem(elem, childElem) {
  elem.insertAdjacentElement("afterbegin", childElem);
  return;
}

export function setTabIndex(elements) {
  elements.forEach((elem) => {
    const tabIndex = parseInt(elem.getAttribute("tabindex"));
    elem.setAttribute("tabindex", tabIndex ? 0 : -1);
  });
  return;
}

export function goalLabelHTML() {
  const goalLabel = `
    <div class="progressBar">
        <div class="progressBar-interval">
        </div>
    </div>
    <input class="goalInput" type="text" placeholder="Goal Name...">
    <label class="goalLabel hide-elem"></label>
    `;
  return goalLabel;
}

export function taskLabelHTML() {
  const taskLabel = `
  <div class="task-infoFrame">
  <div class="checkbox">
      <object class="checkbox-icon" data="" type="text/svg+xml" tabindex="-1"></object>
  </div>
  <input class="task-nameInput" type="text" placeholder="Name of your task...">
  <div class="task-nameFrame">
      <span class="task-name hide-elem">This is my task</span>
      <span class="task-tabName hide-elem">Inbox</span>
  </div>
</div>
<div class="task-noteFrame">
  <input class="task-noteInput" type="text" placeholder="Notes..." tabindex="-1">
  <span class="task-note hide-elem">These are my notes</span>
</div>
<div class="task-btnFrame">
  <button class="task-btn" data-app="setTaskDateBtn" tabindex="-1">
      <div class="btnLblFrame btnLblFrame--task">
          <object class="btnLblFrame-icon" data="../src/icons/dateIcon.svg" type="text/svg+xml"
              tabindex="-1"></object>
          <span class="btnLblFrame-text">Date</span>
      </div>
  </button>
  <button class="task-btn" data-app="trashTaskBtn" tabindex="-1">
      <div class="btnLblFrame btnLblFrame--task">
          <object class="btnLblFrame-icon" data="../src/icons/trashIcon.svg" type="text/svg+xml"
              tabindex="-1"></object>
          <span class="btnLblFrame-text">Trash</span>
      </div>
  </button>
</div>
  `;

  return taskLabel;
}
