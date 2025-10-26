# API Documentation

## Funding Deals API

### POST /api/deals

새로운 펀딩 딜을 생성합니다.

#### 인증

임시: 요청 본문에 `userId`를 포함해야 합니다.
향후: JWT 토큰 또는 세션 기반 인증으로 변경 예정

#### 요청

**Method:** `POST`
**Content-Type:** `application/json`

**Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `menuItemId` | string | Yes | 메뉴 아이템 ID |
| `targetCount` | number | Yes | 목표 참여 인원 (1 이상) |
| `discountedPrice` | number | Yes | 할인된 가격 (원 단위, 1 이상) |
| `deadline` | string | Yes | 마감 기한 (ISO 8601 형식, 미래 날짜) |
| `seasonName` | string | No | 시즌 이름 (기본값: "{현재년도} 특별 딜") |
| `description` | string | No | 딜 설명 |
| `userId` | string | Yes | 사용자 ID (임시) |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/deals \
  -H "Content-Type: application/json" \
  -d '{
    "menuItemId": "clx1234567890",
    "seasonName": "2025 겨울 시즌",
    "targetCount": 50,
    "discountedPrice": 8000,
    "deadline": "2025-12-31T23:59:59Z",
    "description": "겨울 한정 특별 할인!",
    "userId": "clx0987654321"
  }'
```

```javascript
// JavaScript/TypeScript 예시
const response = await fetch('/api/deals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    menuItemId: 'clx1234567890',
    seasonName: '2025 겨울 시즌',
    targetCount: 50,
    discountedPrice: 8000,
    deadline: new Date('2025-12-31T23:59:59Z').toISOString(),
    description: '겨울 한정 특별 할인!',
    userId: 'clx0987654321',
  }),
});

const data = await response.json();
```

#### 응답

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Funding deal created successfully",
  "data": {
    "id": "clx1111111111",
    "seasonName": "2025 겨울 시즌",
    "targetCount": 50,
    "currentCount": 0,
    "discountedPrice": 8000,
    "deadline": "2025-12-31T23:59:59.000Z",
    "status": "ACTIVE",
    "description": "겨울 한정 특별 할인!",
    "menuItemId": "clx1234567890",
    "menuItem": {
      "id": "clx1234567890",
      "name": "김치찌개",
      "description": "맛있는 김치찌개",
      "price": 12000,
      "imageUrl": "https://example.com/image.jpg",
      "restaurant": {
        "id": "clx9999999999",
        "name": "맛있는 식당",
        "address": "서울특별시 강남구 테헤란로 123"
      }
    },
    "createdAt": "2025-10-26T12:00:00.000Z",
    "updatedAt": "2025-10-26T12:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - 필수 필드 누락:
```json
{
  "error": "Missing required fields",
  "required": ["menuItemId", "targetCount", "discountedPrice", "deadline", "userId"]
}
```

**400 Bad Request** - 잘못된 값:
```json
{
  "error": "targetCount must be greater than 0"
}
```

**403 Forbidden** - 권한 없음:
```json
{
  "error": "Unauthorized: You are not the owner of this restaurant"
}
```

**404 Not Found** - 메뉴 아이템 없음:
```json
{
  "error": "Menu item not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

---

### GET /api/deals

펀딩 딜 목록을 조회합니다.

#### 요청

**Method:** `GET`

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `available` | string | No | 'true'일 때 참여 가능한 딜만 조회 (ACTIVE 상태 + 마감 전) |
| `status` | string | No | 상태 필터 (ACTIVE, SUCCESS, FAILED, CLOSED) |
| `restaurantId` | string | No | 특정 가게의 딜만 조회 |

**Example Request:**

```bash
# 현재 참여 가능한 모든 딜 조회 (추천)
curl http://localhost:3000/api/deals?available=true

# 모든 활성 딜 조회
curl http://localhost:3000/api/deals?status=ACTIVE

# 특정 가게의 딜 조회
curl http://localhost:3000/api/deals?restaurantId=clx9999999999

# 특정 가게의 참여 가능한 딜만 조회
curl http://localhost:3000/api/deals?available=true&restaurantId=clx9999999999
```

```javascript
// JavaScript/TypeScript 예시
// 참여 가능한 모든 딜 조회
const response = await fetch('/api/deals?available=true');
const data = await response.json();

console.log(`총 ${data.count}개의 딜을 찾았습니다.`);
data.data.forEach(deal => {
  console.log(`${deal.menuItem.restaurant.name} - ${deal.menuItem.name}`);
  console.log(`할인율: ${deal.metadata.discountRate}%`);
  console.log(`마감: ${deal.metadata.daysRemaining}일 남음`);
});
```

#### 응답

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx1111111111",
      "seasonName": "2025 겨울 시즌",
      "targetCount": 50,
      "currentCount": 15,
      "discountedPrice": 8000,
      "deadline": "2025-12-31T23:59:59.000Z",
      "status": "ACTIVE",
      "description": "겨울 한정 특별 할인!",
      "menuItem": {
        "id": "clx1234567890",
        "name": "김치찌개",
        "description": "맛있는 김치찌개",
        "price": 12000,
        "imageUrl": "https://example.com/image.jpg",
        "isAvailable": true,
        "restaurant": {
          "id": "clx9999999999",
          "name": "맛있는 식당",
          "address": "서울특별시 강남구 테헤란로 123",
          "phoneNumber": "02-1234-5678",
          "imageUrl": "https://example.com/restaurant.jpg",
          "description": "건강한 한식 전문점"
        }
      },
      "_count": {
        "subscriptions": 15
      },
      "metadata": {
        "participationRate": 30.0,
        "remainingCount": 35,
        "discountRate": 33,
        "daysRemaining": 45,
        "isAlmostFull": false,
        "isExpiringSoon": false
      },
      "createdAt": "2025-10-26T12:00:00.000Z",
      "updatedAt": "2025-10-26T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Response 필드 설명:**

| Field | Description |
|-------|-------------|
| `metadata.participationRate` | 참여율 (0-100, 소수점 1자리) |
| `metadata.remainingCount` | 남은 참여 인원 수 |
| `metadata.discountRate` | 할인율 (원가 대비 %) |
| `metadata.daysRemaining` | 마감까지 남은 일수 |
| `metadata.isAlmostFull` | 거의 마감 여부 (80% 이상) |
| `metadata.isExpiringSoon` | 곧 만료 여부 (3일 이하) |

**정렬 순서:**
1. 마감 기한 임박한 순 (deadline ASC)
2. 최신 생성 순 (createdAt DESC)

---

## 데이터 모델

### FundingDeal Status

- `ACTIVE`: 모집 중
- `SUCCESS`: 성공 (목표 달성)
- `FAILED`: 실패 (기한 만료)
- `CLOSED`: 종료

### 비즈니스 로직

1. **딜 생성 시 검증**:
   - 요청자가 해당 메뉴의 가게 사장님인지 확인
   - 메뉴 아이템이 사용 가능한 상태인지 확인
   - 목표 인원과 할인 가격이 유효한 값인지 확인
   - 마감 기한이 미래 날짜인지 확인

2. **초기 상태**:
   - `status`: `ACTIVE` (모집 중)
   - `currentCount`: `0`

3. **향후 구현 예정**:
   - 목표 달성 시 자동으로 `SUCCESS` 상태로 변경
   - 마감 기한 도달 시 미달성이면 `FAILED` 상태로 변경
   - 사장님이 수동으로 `CLOSED` 상태로 변경 가능
