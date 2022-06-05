export default function demoData () {
  let body = 'trash1\r\n';
  body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
  body +=
    'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"\r\n';
  body += 'Content-Type: text/plain\r\n';
  body += '\r\n';
  body += '@11X';
  body += '111Y\r\n';
  body += '111Z\rCCCC\nCCCC\r\nCCCCC@\r\n\r\n';
  body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
  body +=
    'Content-Disposition: form-data; name="uploads[]"; filename="B.txt"\r\n';
  body += 'Content-Type: text/plain\r\n';
  body += '\r\n';
  body += '@22X';
  body += '222Y\r\n';
  body += '222Z\r222W\n2220\r\n666@\r\n';
  body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp\r\n';
  body += 'Content-Disposition: form-data; name="input1"\r\n';
  body += '\r\n';
  body += 'value1\r\n';
  body += '------WebKitFormBoundaryvef1fLxmoUdYZWXp--\r\n';
  return {
    body: Buffer.from(body),
    boundary: '----WebKitFormBoundaryvef1fLxmoUdYZWXp'
  };
}
