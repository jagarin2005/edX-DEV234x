document.getElementById('box').addEventListener('keypress', (e) => {
  if(e.keyCode == "13") {
    e.preventDefault();
    imageCheck();
  }
})
document.getElementById('btn').addEventListener('click', (e) => {
  e.preventDefault();
  imageCheck();
});

function imageCheck() {
  let imgUrl = document.getElementById('box').value;
  let img = document.getElementById('image');
  while( img.hasChildNodes()) {
    img.removeChild(img.firstChild);
  }
  fetch(imgUrl)
    .then((res) => {
      if(!res.ok) {
        document.getElementById('text').innerHTML = "No Face Detected!";
        return res;
      }else{
        let imgEl = document.createElement('IMG');
        imgEl.src = document.getElementById('box').value;
        imgEl.style.width = "25%";
        imgEl.style.height = "25%";
        img.appendChild(imgEl);
        imageProcess();
      }
    })
    .catch((err) => {
      console.log(err);
    })
  
  
}

function imageProcess() {
  let uri = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceAttributes=age,gender";
  let key = "f42f33d081bb493c8716fdef2c6c6222";
  let header = new Headers({
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': key
  });

  let body = {
    'url': document.getElementById('box').value
  };

  let initObject = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: header
  };

  let request = new Request(uri, initObject);

  fetch(request)
    .then((res) => {
      if( res.ok ) {
        return res.json();
      }else{
        return Promise.reject(new Error(res.statusText));
      }
    })
    .then((res) => {
      document.getElementById('text').innerHTML = 
        "Age    : " + res[0].faceAttributes.age + "<br />" +
        "Gender : " + res[0].faceAttributes.gender;
      console.log(res);
    })
    .catch((err) => {
      alert(err)
      console.log(err);
      document.getElementById('text').innerHTML = err;
    });
  

}