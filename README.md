## Description
A web application that allows users to create an account, sign in, and manage/see vehicle inventory with various permissions according to their credentials. 
Authorization is managed using JSON webtoken, and passwords are hashed. 
All data is stored in a PostgreSQL database that is hosted on render.com. 

## Technologies Used
 - PostgreSQL
 - Javascript
 - HTML/CSS
 - Node.js

## Registered Accounts to Use in website
If you'd like to test all aspects of the website, you'll need to be logged into one of these accounts, or make your own account to test out basic user functions. Don't worry about deleting stuff, I have a seed file that I could reinitialize if needed.
### Basic user credentials 
- Only can update personal information
- account_email: basic@340.edu
- account_password: I@mABas1cCl!3nt

### Employee User Credentials
- Can update/manage/add vehicle Items
- account_email: happy@340.edu
- account_password: I@mAnEmpl0y33

### Admin User Credentials
- Can perform employee actions and manage all accounts.
- account_email: manager@340.edu
- account_password: I@mAnAdm!n1strat0r

## Render Link
- https://vehicle-management-7tvk.onrender.com
