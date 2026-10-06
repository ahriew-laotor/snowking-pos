// @/data/products.ts (ຫຼື ບ່ອນທີ່ເຈົ້າຕ້ອງການສ້າງ)
import { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  // ໝວດຂອງກິນຫຼິ້ນ (snacks)
  { id: "p1", categoryId: "snacks", name: "ຊ໋ອກໂກແລ໋ດອົບກອບ", price: 5000 },
  { id: "p2", categoryId: "snacks", name: "ເຢນລີ້ເລມ້ອນ", price: 8000 },
  { id: "p3", categoryId: "snacks", name: "ຕີນໄກ່ລົດໝາລ່າ", price: 4000 },
  {
    id: "p4",
    categoryId: "snacks",
    name: "ມັນຝຣັ່ງອົບກອບລົດນ້ຳເຜິ້ງ",
    price: 6000,
  },
  { id: "p5", categoryId: "snacks", name: "ສາລີອົບກອບ", price: 8000 },
  { id: "p6", categoryId: "snacks", name: "ຂະໜົມເລລົດໝາກນາວ", price: 10000 },

  // ໝວດ ກາເຟ (coffee)
  { id: "p7", categoryId: "coffee", name: "ອາເມຣິກາໂນ່", price: 18000 },
  { id: "p8", categoryId: "coffee", name: "ນ້ຳຕານແດງລາເຕ້", price: 18000 },
  { id: "p9", categoryId: "coffee", name: "ລາເຕ້", price: 18000 },
  { id: "p10", categoryId: "coffee", name: "ມ໋ອກຄ້າ", price: 18000 },

  // ໝວດ ໄອສຄຣີມ (ice-cream)
  { id: "p11", categoryId: "ice-cream", name: "ໄອສຄຣີມວານິລາ", price: 7000 },
  {
    id: "p12",
    categoryId: "ice-cream",
    name: "ຊ໋ອກໂກແລ໋ດ ຊັນເດ",
    price: 18000,
  },
  {
    id: "p13",
    categoryId: "ice-cream",
    name: "ສະຕໍເບີຣີ່ ຊັນເດ",
    price: 18000,
  },
  {
    id: "p14",
    categoryId: "ice-cream",
    name: "ໂອລີໂອ້ ຊັນເດ",
    price: 18000,
  },
  {
    id: "p15",
    categoryId: "ice-cream",
    name: "ໝາກມ່ວງ ຊັນເດ",
    price: 18000,
  },
  {
    id: "p16",
    categoryId: "ice-cream",
    name: "ບຣູເບີລີ້ ຊັນເດ",
    price: 18000,
  },

  // ໝວດ ຊາຜົນໄມ້ (fruit-tea)
  { id: "p17", categoryId: "fruit-tea", name: "ນ້ຳໝາກນາວ", price: 12000 },
  { id: "p18", categoryId: "fruit-tea", name: "ຊາແດງໝາກນາວ", price: 14000 },
  { id: "p19", categoryId: "fruit-tea", name: "ຊາສະຕໍເບີຣີ່", price: 20000 },
  { id: "p20", categoryId: "fruit-tea", name: "ຊາໝາກກ້ຽງ", price: 20000 },
  { id: "p21", categoryId: "fruit-tea", name: "ຊາພີຊຊີ້", price: 20000 },
  { id: "p22", categoryId: "fruit-tea", name: "ຊາບຣູເບີລີ້", price: 16000 },
  { id: "p23", categoryId: "fruit-tea", name: "ຊາພີຊເຫຼືອງ", price: 20000 },

  // ໝວດ ຊານົມ (milk-tea)
  { id: "p24", categoryId: "milk-tea", name: "ຊານົມໄຂ່ມຸກ", price: 22000 },
  { id: "p25", categoryId: "milk-tea", name: "ຊານົມວຸ້ນໝາກພ້າວ", price: 22000 },
  { id: "p26", categoryId: "milk-tea", name: "ຊານົມ 3 ທ໋ອບປິ້ງ", price: 25000 },
  { id: "p27", categoryId: "milk-tea", name: "ຊານົມໂອລີໂອ້", price: 22000 },
  { id: "p28", categoryId: "milk-tea", name: "ຊານົມຊ໋ອກໂກແລ໋ດ", price: 22000 },
  { id: "p29", categoryId: "milk-tea", name: "ຊານົມນ້ຳຕານແດງ", price: 22000 },
  { id: "p30", categoryId: "milk-tea", name: "ຊານົມໄອສຄຣີມ", price: 22000 },
  { id: "p31", categoryId: "milk-tea", name: "ຊານົມດັບໂບ້", price: 22000 },
];
