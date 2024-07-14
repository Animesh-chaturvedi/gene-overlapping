import React, { useState, useEffect } from 'react';
import ImageList from "./images.json"
import SingleSelectCheckbox from './customCheckbox';
import "./App.css"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./cartoonImages', false, /\.(png|jpe?g|svg)$/));
const originalImages = importAll(require.context('./originalImages', false, /\.(png|jpe?g|svg)$/));

function App() {
  const [selected,setSelected] = useState({red:"",blue:"",green:""})
  const [originals, setOriginals] = useState({ red: '', blue: '', green: '' });
  const [modifiedImages, setModifiedImages] = useState({red:'',blue:'',green:''});
  const [selectedImages, setSelectedImages] = useState({red:'',blue:'',green:''});


  useEffect(() => {
    if(originalImages){
      Object.keys(originals).map((color) => {
        Object.entries(originalImages).map(([key,src]) => {
          if(key === selected[color]){
            setSelectedImages({...selectedImages,[color]:src})
          }
        })
      })
    }
    if (selected && images) {
      Object.keys(selected).map((color) => {
        Object.entries(images).map(([key,src]) => {
          if(key === selected[color]){
            modifyImage(src, color); // Modify the image color when selected
          }
        })
      })
    }
  }, [selected]);

  console.log(selectedImages,"original")

  const modifyImage = (src, color) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Adjust pixels based on color threshold logic
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        if (red > 200 && green > 200 && blue > 200) {
          switch (color) {
            case 'red':
              data[i] = 255; data[i + 1] = 0; data[i + 2] = 0;
              break;
            case 'blue':
              data[i] = 0; data[i + 1] = 0; data[i + 2] = 255;
              break;
            case 'green':
              data[i] = 0; data[i + 1] = 255; data[i + 2] = 0;
              break;
            default:
              break;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setModifiedImages(prev => ({ ...prev, [src]: canvas.toDataURL('image/png') }));
    };
  }

  return (
    <div className='App-body' >
      <h1>Pick patterns you want to see together (Maximum 3).</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{display:"flex", justifyContent:"space-between", width:'100%'}} >
      <div className='App-checkbox-cont'>
        <div className='App-checkbox-heading'>Select Images for first pattern</div>
        <SingleSelectCheckbox pattern="red" changeSelected={(color,src) => setSelected({...selected, [color]:src})} selected={selected} />
      </div>
      <div className='App-checkbox-cont'>
        <div className='App-checkbox-heading'>Select Images for second pattern</div>
        <SingleSelectCheckbox pattern="blue" changeSelected={(color,src) => setSelected({...selected, [color]:src})} selected={selected} />
      </div>
      <div className='App-checkbox-cont'>
        <div className='App-checkbox-heading'>Select Images for third pattern</div>
        <SingleSelectCheckbox pattern="green" changeSelected={(color,src) => setSelected({...selected, [color]:src})} selected={selected} />
      </div>
      </div>
    </div>
      <div style={{ position: 'relative', margin: '20px', width:'400px', height:"400px", margin:"0 auto", border:"1px solid black", borderRadius:"6px", marginTop:"24px", }}>
        {Object.entries(modifiedImages).map(([key, src]) => src && (
          <img key={key} src={src} alt={`${key} Modified`} style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5,width:'400px', height:"400px", margin:"0 auto" }} />
        ))}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop:"72px", margin:"0 auto", gap:"32px", justifyContent:'space-around' }}>
        {Object.entries(selectedImages).map(([key, src]) => {
          console.log(src,"key")
          return (
         selectedImages[key] ? <img key={key} src={src} alt={`${key} Original`} style={{ width: '200px', height: '200px', marginBottom: '20px' }} /> : null
        )})}
      </div>
    </div>
  );
}

export default App;
