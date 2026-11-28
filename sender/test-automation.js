'use strict';
const assert = require('node:assert/strict');
const { localParts, atOrAfter, signedOnly, shouldRunAutomatic } = require('./automation');

const before = new Date('2026-11-28T13:59:00.000Z'); // 15:59 Libya
const atTime = new Date('2026-11-28T14:00:00.000Z'); // 16:00 Libya
const after = new Date('2026-11-28T14:05:00.000Z'); // 16:05 Libya
assert.equal(localParts(before, 'Africa/Tripoli').hour, '15');
assert.equal(shouldRunAutomatic({enabled:true,now:before,time:'16:00'}), false);
assert.equal(shouldRunAutomatic({enabled:true,now:atTime,time:'16:00'}), true);
assert.equal(shouldRunAutomatic({enabled:true,now:after,time:'16:00'}), true);
assert.equal(shouldRunAutomatic({enabled:false,now:after,time:'16:00'}), false);

const orders = [{no:'A-1'},{no:'A-2'},{no:'A-3'}];
const receipts = new Map([
 ['A-1',{recipient_name:'Ahmed Ali',signature_png:'data:image/png;base64,AAAA',items:[{id:1}]}],
 ['A-2',{recipient_name:'   ',signature_png:'data:image/png;base64,BBBB',items:[{id:2}]}],
 ['A-3',{recipient_name:'Sara',signature_png:null,items:[{id:3}]}]
]);
const result = signedOnly(orders,receipts);
assert.deepEqual(result.eligible.map(x=>x.no),['A-1']);
assert.deepEqual(result.waiting.map(x=>x.no),['A-2','A-3']);
console.log('Automation tests passed: Libya 16:00 schedule gate, disabled gate, and mandatory named signatures.');
