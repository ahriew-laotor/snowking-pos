// @/data/products.ts (ຫຼື ບ່ອນທີ່ເຈົ້າຕ້ອງການສ້າງ)
import { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  { id: "p1", categoryId: "snacks", name: "ຊ໋ອກໂກແລ໋ດອົບກອບ", price: 10000 },
  { id: "p2", categoryId: "snacks", name: "ເຢນລີ້ເລມ້ອນ", price: 10000 },
  { id: "p3", categoryId: "snacks", name: "ຕີນໄກ່ລົດໝາລ່າ", price: 12000 },
  {
    id: "p4",
    categoryId: "snacks",
    name: "ມັນຝຣັ່ງອົບກອບລົດນ້ຳເຜິ້ງ",
    price: 10000,
  },
  { id: "p5", categoryId: "snacks", name: "ສາລີອົບກອບ", price: 10000 },
  { id: "p6", categoryId: "snacks", name: "ຂະໜົມເລລົດໝາກນາວ", price: 15000 },

  // ໝວດ ກາເຟ (coffee)
  { id: "p7", categoryId: "coffee", name: "ອາເມຣິກາໂນ່", price: 12000 },
  { id: "p8", categoryId: "coffee", name: "ກາເຟນົມ", price: 16000 },

  // ໝວດ ໄອສຄຣີມ (ice-cream)
  { id: "p9", categoryId: "ice-cream", name: "ໄອສຄຣີມວານິລາ", price: 10000 },
  { id: "p10", categoryId: "ice-cream", name: "ຊັນເດ ໂກໂກ້", price: 16000 },
  {
    id: "p11",
    categoryId: "ice-cream",
    name: "ຊັນເດ ສະຕໍເບີຣີ່",
    price: 16000,
  },

  // ໝວດ ຊາຜົນໄມ້ (fruit-tea)
  { id: "p12", categoryId: "fruit-tea", name: "ຊາມະນາວ", price: 12000 },
  { id: "p13", categoryId: "fruit-tea", name: "ຊາສະຕໍເບີຣີ່", price: 16000 },
  { id: "p14", categoryId: "fruit-tea", name: "ຊາມະໂມງ", price: 22000 },

  // ໝວດ ຊານົມ (milk-tea)
  { id: "p15", categoryId: "milk-tea", name: "ຊານົມມຸກ", price: 16000 },
  { id: "p16", categoryId: "milk-tea", name: "ຊານົມວຸ້ນດຳ", price: 16000 },
  { id: "p17", categoryId: "milk-tea", name: "ຊານົມ 2 ຢ່າງ", price: 22000 },
];
