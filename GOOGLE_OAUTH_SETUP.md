# Hướng dẫn cấu hình Google OAuth để fix lỗi origin_mismatch

## Lỗi: Error 400: origin_mismatch

Lỗi này xảy ra khi domain/origin của frontend chưa được đăng ký trong Google Cloud Console.

## Các bước khắc phục:

### 1. Truy cập Google Cloud Console
- Vào: https://console.cloud.google.com/
- Chọn project của bạn
- Điều hướng: **APIs & Services** > **Credentials**

### 2. Tìm OAuth 2.0 Client ID
- Tìm OAuth 2.0 Client ID đang sử dụng (Client ID trong file `.env`)
- Click vào để chỉnh sửa

### 3. Thêm Authorized JavaScript origins
Trong phần **Authorized JavaScript origins**, thêm các origins sau:

**Cho môi trường Development:**
```
http://localhost:5173
http://127.0.0.1:5173
```

**Cho môi trường Production (khi deploy):**
```
https://yourdomain.com
https://www.yourdomain.com
```

**Lưu ý quan trọng:**
- ✅ KHÔNG có dấu `/` ở cuối
- ✅ Phải có `http://` hoặc `https://`
- ✅ Phải khớp chính xác với URL đang chạy

### 4. Thêm Authorized redirect URIs (nếu cần)
Nếu bạn sử dụng redirect flow, thêm các URIs sau:

```
http://localhost:5173
http://localhost:5173/callback
```

### 5. Lưu và chờ
- Click **SAVE**
- Đợi 2-5 phút để Google cập nhật
- Refresh lại trang và thử lại

## Kiểm tra origin hiện tại

Để biết origin nào đang được sử dụng, mở Console trong browser và chạy:
```javascript
console.log(window.location.origin);
```

Sau đó thêm origin đó vào Google Cloud Console.

## Ví dụ cấu hình đầy đủ

**Authorized JavaScript origins:**
```
http://localhost:5173
http://127.0.0.1:5173
https://eduboost.example.com
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://localhost:5173/callback
https://eduboost.example.com
https://eduboost.example.com/callback
```

## Troubleshooting

1. **Vẫn bị lỗi sau khi thêm origin:**
   - Đợi 5-10 phút
   - Clear cache và cookies
   - Thử lại với incognito mode

2. **Không biết origin nào đang dùng:**
   - Check URL trong browser address bar
   - Lấy phần `protocol://domain:port` (ví dụ: `http://localhost:5173`)

3. **Lỗi khi deploy production:**
   - Đảm bảo đã thêm HTTPS origin
   - Check xem domain có đúng không
   - Verify SSL certificate
