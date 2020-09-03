
const form = document.getElementById('form');
const search = document.getElementById('search');
const getList = () => new Promise((res) => {
  chrome.storage.sync.get("blacklist", function (items) {
    if (Array.isArray(items.blacklist)) {
      return res(items.blacklist.concat())
    }
    return res([])
  })
})
const setList = (array) => new Promise((res) => {
  const blacklist = { blacklist: array }
  chrome.storage.sync.set(blacklist, function () {
    res(array);
  });
})

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const blockedSites = await getList();
  const blockText = blockedSites.map(a => `-${a}`).join(' ');
  const query = `${search.value} ${blockText}`;
  const url = `https://google.com/search?q=${query}`;
  chrome.tabs.create({ url });
})
const blacklistForm = document.getElementById('blacklist');

const deleteItem = async (tr, index) => {
  // blacklistForm.removeChild(tr)
  tr.remove();
  const newArray = await getList();
  newArray.splice(index, 1);
  // drawList(newArray);
  await setList(newArray);

}
const drawList = (newArray) => {
  blacklistForm.innerHTML = '';
  // chrome.storage.sync.get("blacklist", function (items) {
  // console.log('items', items);
  newArray.forEach((ii, index) => {
    const tr = document.createElement('tr')
    tr.classList.add('item')
    const textTd = document.createElement('td');
    textTd.classList.add('text');
    textTd.innerText = `${ii}`;
    const deleteTd = document.createElement('td')
    deleteTd.classList.add('delete');
    deleteTd.innerText = `X`;

    deleteTd.addEventListener('click', () => deleteItem(tr, index))
    tr.appendChild(textTd);
    tr.appendChild(deleteTd);

    blacklistForm.appendChild(tr)
    // return tr;
    // return `
    //   <tr class="item">
    //     <td class="text">${ii}</td>
    //     <td class="delete">X</td>
    //   </tr>
    // `
  });


  // });
}
getList().then(newArray => {
  drawList(newArray);
})

const blacklistAddForm = document.getElementById('add-form');
const blacklistItem = document.getElementById('blacklist-item-name');
blacklistAddForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = blacklistItem.value;
  blacklistItem.value = '';
  const newArray = await getList();
  newArray.push(value);
  drawList(newArray);
  await setList(newArray);
})