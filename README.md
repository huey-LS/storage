
#### cookie
```js
var s = new Storage('name', { type: 'cookie' });
s.set('a');
s.get() === 'a' // true
s.remove();
s.get(); // null
```

#### localStorage
```js
var s = new Storage('name', { type: 'localStorage' });
s.set('a');
s.get() === 'a' // true
s.remove();
s.get(); // null
```