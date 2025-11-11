// รอให้ฟอนต์โหลดเสร็จก่อน
document.fonts.ready.then(() => {
  console.log('Fonts loaded');
});

// ฟังก์ชัน preview รูปเมื่อเลือกไฟล์
function previewImage(inputEl, imgId) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById(imgId).src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// เพิ่ม event listener ให้ input รูป
document.getElementById('before').addEventListener('change', function(){ 
  previewImage(this, 'beforePreview'); 
});

document.getElementById('after').addEventListener('change', function(){ 
  previewImage(this, 'afterPreview'); 
});

// ฟังก์ชันตั้งค่าวันที่เป็นวันปัจจุบัน
window.addEventListener('load', () => {
  const dateInput = document.getElementById('date');
  if (!dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
});

// ฟังก์ชันบันทึกเป็น JPG (แก้ไขให้รอฟอนต์และแปลง textarea ก่อน)
document.getElementById('saveBtn').addEventListener('click', async () => {
  const celebration = document.getElementById('celebration');
  celebration.classList.remove('hidden');
  setTimeout(() => celebration.classList.add('hidden'), 2000);
  
  const sType = document.getElementById('sType').value || '';
  const capture = document.getElementById('capture-area');

  try {
    // รอให้ฟอนต์โหลดเสร็จ
    await document.fonts.ready;
    // รอให้รูปโหลดครบ
    await new Promise(resolve => setTimeout(resolve, 300));

    // ✅ แปลง textarea ให้เป็น div ก่อน capture เพื่อให้ข้อความไม่หายและขึ้นบรรทัดใหม่
    const textareas = capture.querySelectorAll('textarea');
    textareas.forEach(t => {
      const div = document.createElement('div');
      const style = window.getComputedStyle(t);
      div.textContent = t.value;
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordBreak = 'break-word';
      div.style.overflowWrap = 'break-word';
      div.style.font = style.font;
      div.style.color = style.color;
      div.style.padding = style.padding;
      div.style.border = style.border;
      div.style.borderRadius = style.borderRadius;
      div.style.background = style.backgroundColor;
      div.style.width = t.offsetWidth + 'px';
      div.style.minHeight = t.offsetHeight + 'px';
      div.style.lineHeight = style.lineHeight;
      div.style.boxSizing = 'border-box';
      div.classList.add('textarea-clone');
      t.style.display = 'none';
      t.parentNode.insertBefore(div, t);
    });

    // ✅ Capture
    const canvas = await html2canvas(capture, { 
      scale: 3,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('capture-area');
        if (clonedElement) {
          clonedElement.style.fontFamily = "'Sarabun', sans-serif";
        }
      }
    });

    // ✅ คืนค่า textarea กลับมา
    capture.querySelectorAll('.textarea-clone').forEach(div => div.remove());
    textareas.forEach(t => t.style.display = '');

    // ✅ สร้างไฟล์
    const dataURL = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    const now = new Date();
    const dateStr = now.toISOString().slice(0,10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0,5).replace(/:/g, '');
    link.href = dataURL;
    link.download = `5S_${sType || 'snapshot'}_${dateStr}_${timeStr}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => alert(' บันทึก 5ส. สำเร็จ! 😻 พื้นที่ทำงานดีขึ้นเพราะความใส่ใจของคุณเลย ขอบคุณมาก!'), 500);

  } catch (error) {
    console.error('Error:', error);
    alert('❌ เกิดข้อผิดพลาดในการบันทึกรูป\nกรุณาลองใหม่อีกครั้ง');
  }
});
