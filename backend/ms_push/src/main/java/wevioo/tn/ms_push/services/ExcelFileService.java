package wevioo.tn.ms_push.services;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.ms_push.dtos.request.SendSeparately;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

@Service
public class ExcelFileService {
    private static final String UNKNOWN_VALUE = "unknown";
    private static final String NOTIFICATION_ENDPOINT = "notificationendpoint";
    private static final String PUBLIC_KEY = "publickey";
    private static final String AUTH = "auth";

    public List<SendSeparately> generateSendSeparatelyList(Map<String, String[]> placeholderData, WebPushMessage template) {
        List<SendSeparately> sendSeparatelyList = new ArrayList<>();
        int rowCount = placeholderData.values().stream()
                .mapToInt(arr -> arr.length)
                .min()
                .orElse(0);

        for (int i = 0; i < rowCount; i++) {
            Map<String, String> row = new HashMap<>();

            for (String placeholder : template.getPlaceholders()) {
                String[] columnData = placeholderData.getOrDefault(placeholder.toLowerCase(), new String[]{UNKNOWN_VALUE});
                String value = (i < columnData.length) ? columnData[i] : UNKNOWN_VALUE;
                row.put(placeholder, value);
            }

            SendSeparately sendPush = new SendSeparately();
            WebPushSubscription subscriptions = new WebPushSubscription();
            subscriptions.setNotificationEndPoint(placeholderData.getOrDefault(NOTIFICATION_ENDPOINT, new String[]{UNKNOWN_VALUE})[i]);
            subscriptions.setPublicKey(placeholderData.getOrDefault(PUBLIC_KEY, new String[]{UNKNOWN_VALUE})[i]);
            subscriptions.setAuth(placeholderData.getOrDefault(AUTH, new String[]{UNKNOWN_VALUE})[i]);

            sendPush.setWebPushSubscriptions(subscriptions);
            sendPush.setPlaceholderValues(row);

            sendSeparatelyList.add(sendPush);
        }

        return sendSeparatelyList;
    }

    public Map<String, String[]> processExcelFile(MultipartFile file, String[] requiredPlaceholders) throws IOException {
        Map<String, String[]> data = new HashMap<>();

        // Clean up requiredPlaceholders
        requiredPlaceholders = Arrays.stream(requiredPlaceholders)
                .map(placeholder -> placeholder.replaceAll("[\\[\\]\"]", "").trim())
                .toArray(String[]::new);

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            Row headerRow = rowIterator.hasNext() ? rowIterator.next() : null;
            if (headerRow == null) {
                throw new IOException("No header row found in the Excel file.");
            }

            int columnCount = headerRow.getPhysicalNumberOfCells();
            for (int i = 0; i < columnCount; i++) {
                Cell headerCell = headerRow.getCell(i);
                String header = getCellValueAsString(headerCell).toLowerCase();
                data.put(header, new String[sheet.getPhysicalNumberOfRows() - 1]);
            }

            for (String placeholder : requiredPlaceholders) {
                data.putIfAbsent(placeholder.toLowerCase(), new String[sheet.getPhysicalNumberOfRows() - 1]);
            }

            int rowIndex = 0;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                for (int i = 0; i < columnCount; i++) {
                    Cell cell = row.getCell(i);
                    String cellValue = getCellValueAsString(cell);
                    if (cellValue.isEmpty()) {
                        cellValue = "unknown";
                    }
                    String header = getCellValueAsString(headerRow.getCell(i)).toLowerCase();
                    data.get(header)[rowIndex] = cellValue;
                }

                for (String placeholder : requiredPlaceholders) {
                    if (data.get(placeholder.toLowerCase())[rowIndex] == null) {
                        data.get(placeholder.toLowerCase())[rowIndex] = "unknown";
                    }
                }
                rowIndex++;
            }
        }
        return data;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (cell.getNumericCellValue() % 1 == 0) {
                    yield String.valueOf((int) cell.getNumericCellValue());
                } else {
                    yield BigDecimal.valueOf(cell.getNumericCellValue()).toPlainString();
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            case BLANK -> "";
            default -> "Unknown Type";
        };
    }

    public void validateSendSeparatelyList(List<SendSeparately> list) {
        for (SendSeparately item : list) {
            Map<String, String> placeholderValues = item.getPlaceholderValues();
            for (String value : placeholderValues.values()) {
                if (UNKNOWN_VALUE.equals(value) || value.isEmpty()) {
                    throw new IllegalArgumentException("Validation failed: 'unknown' or empty value found in placeholder values.");
                }
            }

            WebPushSubscription subscription = item.getWebPushSubscriptions();
            if (UNKNOWN_VALUE.equals(subscription.getNotificationEndPoint()) ||
                    UNKNOWN_VALUE.equals(subscription.getPublicKey()) ||
                    UNKNOWN_VALUE.equals(subscription.getAuth())) {
                throw new IllegalArgumentException("Validation failed: 'unknown' or empty value found in WebPushSubscription.");
            }
        }
    }


}
