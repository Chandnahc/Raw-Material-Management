# Title: 
## Raw Material Management Web Application using JPDB

# Description: 
```
>Following should be the database schema:
1. ITEMS {ItemID (PK), ItemName, OpeningStock, ItemsReceived, ItemsIssued, UoM}
2. INWARD {ReceiptNo (PK), ReceiptDate, ItemID (FK), QtyReceived}
3. OUTWARD {IssueNo (PK), IssueDate, ItemID (FK), QtyIssued}

>The Application should have following pages:
1. Item Managment Page - This is a form to add new items in the stock or to edit some items details. The form will containg following fields to be entered by user and full navigation and control buttons also should have validations as required on different fields:
> Item ID - Allow user to enter Item ID and check whether this item exist in database. If exist it will load the item's details from the database and disply required information on this page, if Item ID not present it will ask for other details of this new item to be created.
> Item Name - Name of the Raw Material.
> Opening Stock - Numeric 15 total with 3 decimal places.
> Unit of Measurement - Allow 10 characters.
2. Item Received (Inward) Page - This is a form for managing items received in the store. The form will containg following fields to be entered by user and full navigation and control buttons also should have validations and updates as required on different fields:
> Receipt No - If entered item receipt number exists, it will load the details from the database and display required information for further actions using control buttons and navigation buttons. If receipt number not present it will ask the user to enter further details.
> Receipt Date - Date of receipt to be entered.
> Item ID - Item ID to be entered and it must exist in the ITEMS relation and display the item name in front of entered Item ID. If Item is not present It must display an error 'Item not present' and keep the cursor on Item ID field.
> Quantity - User is required to enter the Item received.
3. Item Issue (Outward) Page - This is a form for managing items issued from the store for manufacturing. The form will containg following fields to be entered by user and full navigation and control buttons also should have validations and updates as required on different fields:
> Issue No - If entered item issur number exists, it will load the details from the database and display required information for further actions using control buttons and navigation buttons. If issue number not present it will ask the user to enter further details.
> Issue Date - Date of receipt to be entered.
> Item ID - Item ID to be entered and it must exist in the ITEMS relation and display the item name in front of entered Item ID. If Item is not present It must display an error 'Item not present' and keep the cursor on Item ID field.
> Quantity - User is required to enter the Item issue. It must display error message 'Quantity entered is more than available' and the cursor will remain in the quantity field.
4. Item Report Page - This page will display list of items in tabular form for given range if Item IDs. The report should have a minimum of columns (1) Item ID, (2) Item Name and (3) Current Stock.

The Application Stock Management Dashboard
> The dashboard should have (1) Common Header (2) Common Footer (3) Left Navigation Menu (4) Main page to display one of the above four pages based on selection of menu from the left navigation.
```
# Demo Video
##https://drive.google.com/file/d/1S63J96HPWXGe2C6s_ZLJTtewG58S7EXz/view?usp=share_link

# Important links:
```
>Home page: https://login2explore.com
>Register to use JsonPowerDB: http://api.login2explore.com
>JsonPowerDB Help: https://login2explore.com/jpdb/docs.html
```
