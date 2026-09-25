export interface Criterion {
  id: string;
  title: string;
  maxScore: number;
  step: number; // 2 = แรกรับ, 3 = การเขียน, 4 = คุณภาพ
  options: number[];
}

export const evaluationCriteria: Criterion[] = [
  // --- Step 2: ประเมินผู้ป่วยแรกรับ ---
  { id: '1.1', title: 'มาถึงหอผู้ป่วยโดย', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.2', title: 'อาการสำคัญที่มาโรงพยาบาล', maxScore: 4, step: 2, options: [0, 1, 2, 3, 4] },
  { id: '1.3', title: 'ระบุสัญญาณชีพ', maxScore: 3, step: 2, options: [0, 1, 2, 3] },
  { id: '1.4', title: 'ประวัติการเจ็บป่วยปัจจุบัน', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.5', title: 'ประวัติการเจ็บป่วยในอดีต', maxScore: 2, step: 2, options: [0, 1, 2] },
  { id: '1.6', title: 'ประวัติผ่าตัด', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.7', title: 'ประวัติการแพ้ยา/ อาหาร/อื่นๆ', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.8', title: 'ยาและการรักษาที่ต้องใช้อยู่ประจำ', maxScore: 2, step: 2, options: [0, 1, 2] },
  { id: '1.9', title: 'ประวัติการเจ็บป่วยของครอบครัว', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.10', title: 'การรับรู้เกี่ยวกับสุขภาพ', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.11.1', title: 'อาหารที่รับประทาน', maxScore: 0.5, step: 2, options: [0, 0.5] },
  { id: '1.11.2', title: 'ปัญหาในการรับประทานอาหาร', maxScore: 0.5, step: 2, options: [0, 0.5] },
  { id: '1.11.3', title: 'การเปลี่ยนแปลงน้ำหนักภายใน 6 เดือน', maxScore: 0.5, step: 2, options: [0, 0.5] },
  { id: '1.11.4', title: 'ลักษณะผิวหนัง', maxScore: 0.5, step: 2, options: [0, 0.5] },
  { id: '1.12', title: 'การขับถ่าย', maxScore: 2, step: 2, options: [0, 1, 2] },
  { id: '1.13.1', title: 'โครงสร้างและกำลังของกล้ามเนื้อ', maxScore: 1.5, step: 2, options: [0, 0.5, 1, 1.5] },
  { id: '1.13.2', title: 'ลักษณะการหายใจ', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.14', title: 'การพักผ่อนนอนหลับ', maxScore: 1.5, step: 2, options: [0, 0.5, 1, 1.5] },
  { id: '1.15', title: 'สติปัญญาและการรับรู้', maxScore: 3, step: 2, options: [0, 1, 2, 3] },
  { id: '1.16', title: 'การรับรู้ตนเองและอัตมโนทัศน์', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.17', title: 'บทบาทและสัมพันธภาพ', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.18', title: 'เพศและการเจริญพันธุ์', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.19', title: 'การเผชิญความเครียดและการปรับตัว', maxScore: 1, step: 2, options: [0, 0.5, 1] },
  { id: '1.20', title: 'คุณค่าและความเชื่อ', maxScore: 4, step: 2, options: [0, 1, 2, 3, 4] },
  { id: '1.21', title: 'ความต้องการการวางแผนจำหน่าย', maxScore: 4, step: 2, options: [0, 1, 2, 3, 4] },

  // --- Step 3: การเขียนบันทึกทางการพยาบาล ---
  { id: '2.1', title: 'มีปัญหาและข้อมูลสนับสนุนชัดเจน (F&D)', maxScore: 10, step: 3, options: [0, 2, 4, 6, 8, 10] },
  { id: '2.2', title: 'กิจกรรมการพยาบาล (Action)', maxScore: 10, step: 3, options: [0, 2, 4, 6, 8, 10] },
  { id: '2.3', title: 'การประเมินผลหลังการพยาบาล (R)', maxScore: 10, step: 3, options: [0, 2, 4, 6, 8, 10] },
  { id: '2.4', title: 'ปัญหาทางการพยาบาลเชื่อมโยงกับแผนรักษา', maxScore: 5, step: 3, options: [0, 1, 2, 3, 4, 5] },
  { id: '2.5', title: 'การวางแผนเพื่อเตรียมการจำหน่าย', maxScore: 5, step: 3, options: [0, 1, 2, 3, 4, 5] },

  // --- Step 4: คุณภาพของการบันทึกทางการพยาบาล ---
  { id: '3.1', title: 'ตัวหนังสืออ่านออกง่าย ชัดเจน', maxScore: 5, step: 4, options: [0, 1, 2, 3, 4, 5] },
  { id: '3.2', title: 'ใบเซ็นต์ยินยอมถูกต้อง ครบถ้วน', maxScore: 5, step: 4, options: [0, 1, 2, 3, 4, 5] },
  { id: '3.3.1', title: 'ใบ Medical Records', maxScore: 2, step: 4, options: [0, 1, 2] },
  { id: '3.3.2', title: 'ใบ Graphic sheet', maxScore: 2, step: 4, options: [0, 1, 2] },
  { id: '3.3.3', title: 'ใบ Records อื่นๆ เช่น N/S, CPR', maxScore: 2, step: 4, options: [0, 1, 2] },
  { id: '3.4', title: 'มีการระบุชื่อพยาบาล อ่านได้ชัดเจน', maxScore: 4, step: 4, options: [0, 1, 2, 3, 4] },
];
