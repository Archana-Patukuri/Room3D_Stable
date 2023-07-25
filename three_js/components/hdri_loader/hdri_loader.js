/* eslint-disable */

import {
  EquirectangularReflectionMapping,
  LoadingManager,
  sRGBEncoding,
  TextureLoader,
} from 'three';

export default async function hdriLoad() {
  // const hdriLoader = new RGBELoader(manager).setPath('/hdri/');
  const manager = new LoadingManager(
    (data) => {
      console.log(`loaded HDRI ${data}`);
    },
    (url, itemsLoaded, itemsTotal) => {
      console.log(
        `Loading file: ${url}\nLoaded  ${itemsLoaded} of  ${itemsTotal} files.`
      );
    },
    (url) => {
      console.log(`There was an error loading  ${url}`);
    }
  );
  const textureLoader = new TextureLoader(manager).setPath('/hdri/');

  const [background0, hdri0,hdri1] = await Promise.all([
    textureLoader.loadAsync('lythwood_room_1k.jpg'),    
    textureLoader.loadAsync('lythwood_room_1k_test.jpg'),
    textureLoader.loadAsync('cyclorama_hard_light_1k.jpg'),
  ]);
  background0.encoding = sRGBEncoding;
  background0.mapping = EquirectangularReflectionMapping;
  hdri0.mapping =hdri1.mapping= EquirectangularReflectionMapping;
  return { background0, hdri0,hdri1 };
}