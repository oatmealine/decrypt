# DecrypterExe

a simple hacknet-inspired encryption and decryption system (with passwords, headers, etc)

# Usage

here's a small example of how you can use this:
```js
const Decrypter = require('decrypterexe')

Decrypter.encryptString('noone can see this haha', 'header', '127.0.0.1', 'password', '.txt')
```
this will return an encrypted string that can only be decrypted with `Decrypter.decryptString()`

# Documentation

`Decrypter.encryptString(data, header, ipLink, (password), (fileextension))` - encrypts a string into a proper dec-encrypted file

`Decrypter.decryptString(data, (password))` - decrypts a string encrypted with encryptString

`Decrypter.validData(data)` - checks if encrypted data is valid

`Decrypter.validPassword(data, pass)` - checks if encrypted data's password is valid

`Decrypter.getHeaders(data)` - gets headers from encrypted data without a password

`Decrypter.getPassCode(string)` - a small utility function that "hashes" a string password into a number