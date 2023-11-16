
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = (event) => {
  console.log('WebSocket connection opened');
};

//Receives trigger from the server (chokidar.watcher)
ws.onmessage = (event) => {

  refresh_results();
};

ws.onclose = (event) => {
  console.log('WebSocket connection closed');
};
//=======================================================



//Starts app loading all results into the layout
async function fetch_all_results() {

  try {

    const response = await fetch('/api/message'); // Replace with your API endpoint
    const data = await response.json();


    let ul = document.createElement('ul')

    //Sort 'data' in desc order
    data.sort((a, b) => {

      // Extract the integer part from each file name
      const intA = parseInt(a.split('_')[0]);
      const intB = parseInt(b.split('_')[0]);

      // Compare and return the comparison result in descending order
      return intB - intA;
    });


    data.map(name => {

      let li = document.createElement('li')
      li.classList.add('custom-li')

      //Creates text to the li
      let p = document.createElement('p')
      //Treats crud 'name'

      let namePart1 = name.split('_')[1];
      customName = namePart1.split('.')[0]

      p.textContent = customName

      //creates btn "chamar" to the li
      let btn_call = document.createElement('button')
      btn_call.textContent = "chamar"
      btn_call.setAttribute('name', customName)
      btn_call.classList.add('btn-call')

      li.appendChild(p)
      li.appendChild(btn_call)



      ul.appendChild(li)
    })

    //Gives space for 'load effect'
    setTimeout(() => {
      document.body.appendChild(ul)
  
      call_name();
      
    },1000);


  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
fetch_all_results()

//Starts app loading one result into the layout
//This function is called inside the websockets above
async function refresh_results() {

  try {
    const response = await fetch('/api/message'); // Replace with your API endpoint
    const data = await response.json();


    //Sorts 'data' in desc order
    data.sort((a, b) => {
      const intA = parseInt(a.split('_')[0]);
      const intB = parseInt(b.split('_')[0]);
      return intB - intA;
    });

    //Delele all li's if they exist
    let all_li_elements = document.querySelector('ul')
    if (all_li_elements) {
      all_li_elements.remove()
    }

    //Creates all lis again
    let ul = document.createElement('ul')

    data.map(name => {

      let li = document.createElement('li')
      li.classList.add('custom-li')

      //Creates text to the li
      let p = document.createElement('p')

      //Modifies the crud name
      let namePart1 = name.split('_')[1];
      customName = namePart1.split('.')[0]

      p.textContent = customName

      //creates btn "chamar" to the li
      let btn_call = document.createElement('button')
      btn_call.textContent = "chamar"
      btn_call.setAttribute('name', customName)
      btn_call.classList.add('btn-call')

      li.appendChild(p)
      li.appendChild(btn_call)

      ul.appendChild(li)

    })

    //Gives space for 'load effect'
    setTimeout(() => {
      document.body.appendChild(ul)
  
      call_name();
      
    },1000);


  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


function call_name() {

  setTimeout(() => {

    let [...all_btns] = document.querySelectorAll('.btn-call')

    if (all_btns) {

      all_btns.map(btn => {

        btn.addEventListener('click', () => {


          let speechSynthesis = window.speechSynthesis;

          if ('speechSynthesis' in window) {
            let utterance = new SpeechSynthesisUtterance(btn.name);

            let audioPlayer = document.getElementById('audio-player');
            audioPlayer.play();

            setTimeout(() => {
              speechSynthesis.speak(utterance);

            }, 2000);

          } else {
            alert("Desculpe, seu navegador não suporta a fala por voz");
          }
        })
      })
    }
  }, 1000)
}

