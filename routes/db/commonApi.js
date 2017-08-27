var vendors = require('./routes/db/vendors'),
     member = require('./routes/db/member'),
     memberClass = require('./routes/db/memberClass');
var api = {
    "member": member,
    "vendors": vendors,
    "memberClass": memberClass
}
