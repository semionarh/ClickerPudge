async function callClick(){
  const coins_counter = document.getElementById('data')
  let coins_value = parseInt(coins_counter.innerText)
  const click_power = document.getElementById('click_power').innerText
  coins_value += parseInt(click_power)
  document.getElementById("data").innerHTML = coins_value
  set_all_boosts_availability()
}


async function getUser(id){
  let response = await fetch('/users/' + id,{
    method: 'GET'
  });
  let answer = await response.json();

  document.getElementById("user").innerHTML = answer['username'];
  let getCycle = await fetch('/cycles/' + answer['cycle'],{
    method: 'GET'
  });
  let cycle = await getCycle.json();
  document.getElementById("data").innerHTML = cycle['coins_count'];
  document.getElementById("click_power").innerHTML = cycle['click_power'];
  document.getElementById("auto_click_power").innerHTML = cycle['auto_click_power'];
  let boost_request = await fetch('/boosts/' + answer.cycle, {
    method :'GET'
  })
  let boosts = await boost_request.json()
  render_all_boosts(boosts)
  set_all_boosts_availability()
  set_auto_click()
  set_send_coins_interval()
}


function buyBoost(boost_level) {

    const csrftoken = getCookie('csrftoken')

    fetch('/buy_boost/', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            boost_level: boost_level
        })
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return Promise.reject(response)
        }
    }).then(data => {
        document.getElementById("data").innerHTML = data['coins_count'];
        document.getElementById("click_power").innerHTML = data['click_power'];
        document.getElementById("auto_click_power").innerHTML = data['auto_click_power'];
        var boost = document.getElementById(`boost-holder-${data['level']}`)
        boost.querySelector("#boostPower").innerHTML = data['click_power'];
        boost.querySelector("#boostLevel").innerHTML = data['level'];
        boost.querySelector("#boostPrice").innerHTML = data['price'];
        set_all_boosts_availability()
    })
}


function render_all_boosts(boosts){
  let parent = document.getElementById('boost-wrapper')
  parent.innerHTML =''
  boosts.forEach(boost => {
    render_boost(parent, boost)
  })
}


function render_boost(parent, boost){
  const div = document.createElement('div')
  div.setAttribute('class', 'boost-holder')
  div.setAttribute('id', `boost-holder-${boost.level}`)
  div.innerHTML = `
  <div class="boost-holder" id="boost-holder">
    <input id="buy" type="image" class="catgirl boost" src="https://image.prntscr.com/image/kZmFMsJSRdqyhTutqZfkXQ.png" onclick="buyBoost(${boost.level})" />
    <p> Уровень: <div id="boostLevel"> ${boost.level} </div> </p>
    <p> Длина хука: <div id="boostPower"> ${boost.power} </div></p>
    <p> Стоимость: <div id="boostPrice"> ${boost.price} </div></p>
  </div>
  `
  parent.appendChild(div)
}


function set_all_boosts_availability() {
    const counter = document.getElementById('data')
    const boosts = document.getElementsByClassName('boost-holder')

    for (let boost of boosts) {
        set_boost_availability(counter.innerHTML, boost)
    }
}


function set_boost_availability(coins, boost) {
    const price = boost.querySelector("#boostPrice").innerHTML
    if (parseInt(price) > parseInt(coins)) {
        var bttn = boost.querySelector("#buy")
        bttn.setAttribute('disabled', 'true')
    } else {
        var bttn = boost.querySelector("#buy")
        bttn.removeAttribute('disabled')
    }
}


function set_auto_click() {
    setInterval(function() {
        const coins_counter = document.getElementById('data')
        let coins_value = parseInt(coins_counter.innerText)

        const auto_click_power = document.getElementById('auto_click_power').innerText
        coins_value += parseInt(auto_click_power)
        document.getElementById("data").innerHTML = coins_value;
    }, 1000)
}


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== ''){
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


function set_send_coins_interval() {
    setInterval(function() {
        const csrftoken = getCookie('csrftoken')
        const coins_counter = document.getElementById('data').innerText

        fetch('/set_main_cycle/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coins_count: coins_counter,
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        }).then(data => {
            if (data.boosts)
              render_all_boosts(data.boosts)
            set_all_boosts_availability()
        }).catch(err => console.log(err))

    }, 10000)
}
