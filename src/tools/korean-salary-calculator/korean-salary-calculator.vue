<script setup lang="ts">
import { calculateSalary, formatWon } from './korean-salary-calculator.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const annualManwon = ref(''); // 연봉 (만원)
const monthlyNonTax = ref('200000'); // 월 비과세액 (원)
const dependents = ref('1'); // 공제대상 가족 수 (본인 포함)

const result = computed<CKeyValueListItems>(() => {
  const man = Number(String(annualManwon.value).replace(/[^0-9.]/g, ''));
  if (!(man > 0)) {
    return [];
  }

  const r = calculateSalary({
    annualSalary: man * 10000,
    monthlyNonTax: Number(String(monthlyNonTax.value).replace(/[^0-9.]/g, '')) || 0,
    dependents: Number(String(dependents.value).replace(/[^0-9.]/g, '')) || 1,
  });
  if (!r) {
    return [];
  }

  return [
    { label: '월 실수령액', value: formatWon(r.netMonthly) },
    { label: '연 실수령액', value: formatWon(r.netAnnual), showCopyButton: false },
    { label: '월 급여(세전)', value: formatWon(r.monthlyGross), showCopyButton: false },
    { label: '─ 월 공제 내역 ─', value: ' ', showCopyButton: false },
    { label: '국민연금', value: formatWon(r.nationalPension), showCopyButton: false },
    { label: '건강보험', value: formatWon(r.healthInsurance), showCopyButton: false },
    { label: '장기요양', value: formatWon(r.longTermCare), showCopyButton: false },
    { label: '고용보험', value: formatWon(r.employmentInsurance), showCopyButton: false },
    { label: '소득세', value: formatWon(r.incomeTax), showCopyButton: false },
    { label: '지방소득세', value: formatWon(r.localTax), showCopyButton: false },
    { label: '총 공제액(월)', value: formatWon(r.totalDeduction), showCopyButton: false },
  ];
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="annualManwon"
      label="연봉 (만원)"
      placeholder="예: 3600"
      mb-3
      test-id="salary-input"
    />
    <c-input-text
      v-model:value="monthlyNonTax"
      label="월 비과세액 (원)"
      placeholder="식대 등, 기본 200,000"
      mb-3
    />
    <c-input-text
      v-model:value="dependents"
      label="공제대상 가족 수 (본인 포함)"
      placeholder="기본 1"
    />

    <c-card v-if="result.length > 0" mt-5>
      <c-key-value-list :items="result" data-test-id="salary-result" />
    </c-card>

    <c-alert type="warning" mt-5>
      <b>2025년 기준</b> 추정치입니다 (4대보험 요율·소득세 누진세율). 소득세는 <b>연말정산 기준</b>으로 계산되어, 매월 급여명세서의 원천징수(간이세액표)와는 차이가 있을 수 있고 연말정산으로 정산됩니다.
      자녀세액공제·연금저축 등 개별 공제는 미반영이며, 비과세 식대(기본 월 20만원)·부양가족 수에 따라 달라집니다. 실제 금액은 회사·개인 상황에 따라 다를 수 있습니다.
    </c-alert>
  </div>
</template>
