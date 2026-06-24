const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/landing/Features.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Global replacements
content = content.replace(/bg-\[#1A1A1A\]/g, 'bg-white');
content = content.replace(/bg-\[#222222\]/g, 'bg-gray-50');
content = content.replace(/border-\[#333333\]/g, 'border-gray-200');
content = content.replace(/text-\[#A0A0A0\]/g, 'text-gray-500');
content = content.replace(/text-zinc-400/g, 'text-gray-500');
content = content.replace(/bg-\[#0D1321\]/g, 'bg-slate-900'); // Interview module

// Specific text-white to text-[#111111] replacements
content = content.replace(/text-lg sm:text-xl text-white/g, 'text-lg sm:text-xl text-[#111111]');
content = content.replace(/md:text-5xl text-white tracking-tight/g, 'md:text-5xl text-[#111111] tracking-tight');
content = content.replace(/text-xs font-bold text-white/g, 'text-xs font-bold text-[#111111]');
content = content.replace(/font-bold text-white border-b/g, 'font-bold text-[#111111] border-b');
content = content.replace(/font-bold text-white flex items-center gap-1\.5/g, 'font-bold text-[#111111] flex items-center gap-1.5');
content = content.replace(/<span className="font-bold text-white">/g, '<span className="font-bold text-[#111111]">');
content = content.replace(/<h5 className="font-bold text-white">/g, '<h5 className="font-bold text-[#111111]">');
content = content.replace(/<p className="font-bold text-white">/g, '<p className="font-bold text-[#111111]">');
content = content.replace(/<p className="text-\[10px\] font-bold text-white">/g, '<p className="text-[10px] font-bold text-[#111111]">');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Features.tsx colors replaced.');
