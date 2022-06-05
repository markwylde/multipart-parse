export function parse (multipartBodyBuffer, boundary) {
  let lastline = '';
  let header = '';
  let info = '';
  let state = 0;
  let buffer;
  const allParts = [];

  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const oneByte = multipartBodyBuffer[i];
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const newLineDetected =
      !!(oneByte === 0x0a && prevByte === 0x0d);
    const newLineChar =
      !!(oneByte === 0x0a || oneByte === 0x0d);

    if (!newLineChar) {
      lastline += String.fromCharCode(oneByte);
    }

    if (state === 0 && newLineDetected) {
      if ('--' + boundary === lastline) {
        state = 1;
      }
      lastline = '';
    } else if (state === 1 && newLineDetected) {
      header = lastline;
      state = 2;
      if (header.indexOf('filename') === -1) {
        state = 3;
      }
      lastline = '';
    } else if (state === 2 && newLineDetected) {
      info = lastline;
      state = 3;
      lastline = '';
    } else if (state === 3 && newLineDetected) {
      state = 4;
      buffer = [];
      lastline = '';
    } else if (state === 4) {
      if (lastline.length > boundary.length + 4) lastline = ''; // mem save
      if ('--' + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        const p = { header: header, info: info, part: part };

        allParts.push(process(p));
        buffer = [];
        lastline = '';
        state = 5;
        header = '';
        info = '';
      } else {
        buffer.push(oneByte);
      }
      if (newLineDetected) lastline = '';
    } else if (state === 5) {
      if (newLineDetected) state = 1;
    }
  }
  return allParts;
}

export function getBoundary (header) {
  const items = header.split(';');
  if (items) {
    for (let i = 0; i < items.length; i++) {
      const item = String(items[i]).trim();
      if (item.indexOf('boundary') >= 0) {
        const k = item.split('=');
        return String(k[1]).trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return '';
}

function process (part) {
  const obj = function (str) {
    const k = str.split('=');
    const a = k[0].trim();

    const b = JSON.parse(k[1].trim());
    const o = {};
    Object.defineProperty(o, a, {
      value: b,
      writable: true,
      enumerable: true,
      configurable: true
    });
    return o;
  };

  const header = part.header.split(';');

  const filenameData = header[2];
  let input = {};

  if (filenameData) {
    input = obj(filenameData);
    const contentType = part.info.split(':')[1].trim();
    Object.defineProperty(input, 'type', {
      value: contentType,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  Object.defineProperty(input, 'name', {
    value: header[1].split('=')[1].replace(/"/g, ''),
    writable: true,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(input, 'data', {
    value: Buffer.from(part.part),
    writable: true,
    enumerable: true,
    configurable: true
  });

  return input;
}
