# DecryptorExe

a simple hacknet-inspired encryption and decryption system (with passwords, headers, etc)

# Usage

here's a small example of how you can use this:
```js
const Decryptor = require('decryptorexe')

Decryptor.encryptString('noone can see this haha', 'header', '127.0.0.1', 'password', '.txt')
```
this will return an encrypted string that can only be decrypted with `Decryptor.decryptString()`

# Documentation

`Decryptor.encryptString(data, header, ipLink, (password), (fileextension))` - encrypts a string into a proper dec-encrypted file

`Decryptor.decryptString(data, (password))` - decrypts a string encrypted with encryptString

`Decryptor.validData(data)` - checks if encrypted data is valid

`Decryptor.validPassword(data, pass)` - checks if encrypted data's password is valid

`Decryptor.getHeaders(data)` - gets headers from encrypted data without a password

`Decryptor.getPassCode(string)` - a small utility function that "hashes" a string password into a number
