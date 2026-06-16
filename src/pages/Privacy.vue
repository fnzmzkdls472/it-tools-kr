<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({
  title: '개인정보처리방침 | too-liz',
  link: [{ rel: 'canonical', href: 'https://too-liz.com/privacy' }],
});

const content = `
# 개인정보처리방침

too-liz(이하 "사이트")는 이용자의 개인정보를 중요하게 생각하며, 아래와 같이 개인정보를 처리합니다.

## 1. 도구 사용 시 입력 데이터

본 사이트의 모든 도구는 이용자가 입력한 데이터를 **이용자의 브라우저 안에서만 처리**합니다. 입력값(텍스트, 숫자, 파일 등)은 서버로 전송되거나 저장되지 않습니다.

## 2. 자동 수집 정보 (방문 분석)

사이트 개선을 위해 **Cloudflare Web Analytics**를 사용합니다. 이 분석 도구는 쿠키를 사용하지 않으며, 개인을 식별하지 않는 형태(방문 페이지, 대략적 위치, 기기 종류 등)의 통계만 수집합니다.

## 3. 광고 및 쿠키

본 사이트는 제3자 광고 공급업체인 **Google AdSense**를 통해 광고를 게재할 수 있습니다.

- Google을 비롯한 제3자 공급업체는 **쿠키**를 사용하여 이용자의 이전 방문 기록을 바탕으로 광고를 게재합니다.
- Google은 광고 쿠키를 사용함으로써 이용자가 본 사이트나 다른 사이트를 방문한 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.
- 이용자는 [Google 광고 설정](https://www.google.com/settings/ads)에서 맞춤형 광고를 비활성화할 수 있습니다.
- 제3자 공급업체의 쿠키 사용에 대한 자세한 내용과 차단 방법은 [www.aboutads.info](https://www.aboutads.info/choices/) 에서 확인할 수 있습니다.
- Google의 개인정보 처리에 대해서는 [Google 개인정보처리방침](https://policies.google.com/privacy) 을 참고하세요.

## 4. 제3자 링크

본 사이트는 외부 사이트로 연결되는 링크를 포함할 수 있으며, 외부 사이트의 개인정보 처리에 대해서는 책임지지 않습니다.

## 5. 문의

개인정보 처리에 관한 문의는 아래 이메일로 연락 주시기 바랍니다.

- 이메일: fnzmzkdls472@gmail.com

## 6. 시행일

본 방침은 2026년 6월 16일부터 적용됩니다.
`;
</script>

<template>
  <c-markdown :markdown="content" mx-auto mt-50px max-w-600px />
</template>
