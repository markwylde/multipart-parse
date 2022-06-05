import test from 'basictap';
import { parse, getBoundary } from '../lib/multipart.js';

import demoData from './helpers/demoData.js';

const expected = [
  {
    name: 'uploads[]',
    filename: 'A.txt',
    type: 'text/plain',
    data: Buffer.from('@11X111Y\r\n111Z\rCCCC\nCCCC\r\nCCCCC@\r\n')
  },
  {
    name: 'uploads[]',
    filename: 'B.txt',
    type: 'text/plain',
    data: Buffer.from('@22X222Y\r\n222Z\r222W\n2220\r\n666@')
  },
  { name: 'input1', data: Buffer.from('value1') }
];

test('should parse multipart', t => {
  const { body, boundary } = demoData();
  const parts = parse(body, boundary);

  t.equal(parts.length, 3);
  for (let i = 0; i < expected.length; i++) {
    const data = expected[i];
    const part = parts[i];

    t.equal(data.filename, part.filename);
    t.equal(data.name, part.name);
    t.equal(data.type, part.type);
    t.equal(data.data.toString(), part.data.toString());
  }
});

test('should get boundary', t => {
  const header =
      'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B';
  const boundary = getBoundary(header);

  t.equal(boundary, '----WebKitFormBoundaryvm5A9tzU1ONaGP5B');
});

test('should get boundary in single quotes', t => {
  const header =
      'multipart/form-data; boundary="----WebKitFormBoundaryvm5A9tzU1ONaGP5B"';
  const boundary = getBoundary(header);

  t.equal(boundary, '----WebKitFormBoundaryvm5A9tzU1ONaGP5B');
});

test('should get boundary in double quotes', t => {
  const header =
      "multipart/form-data; boundary='----WebKitFormBoundaryvm5A9tzU1ONaGP5B'";
  const boundary = getBoundary(header);

  t.equal(boundary, '----WebKitFormBoundaryvm5A9tzU1ONaGP5B');
});

test('should not parse multipart if boundary is not correct', t => {
  const { body, boundary } = demoData();
  const parts = parse(body, boundary + 'bad');

  t.equal(parts.length, 0);
});

test('should not parse if multipart is not correct', t => {
  const { boundary } = demoData();
  const parts = parse(Buffer.from('hellow world'), boundary);

  t.equal(parts.length, 0);
});
