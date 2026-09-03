let list = {

};
setTimeout(() => {
    let elements =  document.getElementsByClassName('choix');
    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', selectItem);
      });

  }, 1000)

function selectItem(target){
    let groupId = target.currentTarget.dataset.groupid
    let selectedWord = target.currentTarget.textContent;
    let listElements = document.querySelectorAll(`[data-groupid~="${groupId}"]`);
    listElements.forEach((d)=>{
        d.classList.remove('selected');
    })
    target.currentTarget.classList.add('selected');
    list[groupId]=selectedWord;
    let resultElement = document.getElementById("result");
    while (resultElement.firstChild) {
        resultElement.removeChild(resultElement.firstChild);
      }
    reload(resultElement,document,list);
}

function reload(resultElement,document,list){
   let htmlContent = document.createElement('ul',{class:'list'});
   for (const [key, value] of Object.entries(list)) {
    let element =document.createElement('li')
    element.textContent =`${key}: ${value}`;
    htmlContent.appendChild(element);
  }
  resultElement.appendChild(htmlContent);
}