
#### localStorage
```js
var s = new Storage('key'});
s.set('a');
s.get() === 'a' // true
s.remove();
s.get(); // null
```


#### cookie
```js
var s = new Storage.default('key', { storage: Storage.storages.cookie });
s.set('a');
s.get() === 'a' // true
s.remove();
s.get(); // null
```