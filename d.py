import html, itertools

counter = itertools.count(1)

def esc(s):
    return html.escape(s)

def code_panel(js=None, py=None, cpp=None):
    uid = f"cp{next(counter)}"
    langs = []
    if js is not None: langs.append(("JavaScript","js",js))
    if py is not None: langs.append(("Python","py",py))
    if cpp is not None: langs.append(("C++","cpp",cpp))
    tabs = ""
    panels = ""
    for i,(label,key,code) in enumerate(langs):
        active = " active" if i==0 else ""
        tabs += f'<button class="tab-btn{active}" onclick="showTab(\'{uid}\',\'{key}\',this)">{label}</button>'
        disp = "block" if i==0 else "none"
        panels += f'<pre class="code-block lang-{key}" id="{uid}-{key}" style="display:{disp}"><code>{esc(code)}</code></pre>'
    return f'''<div class="code-panel">
<div class="tab-bar">{tabs}</div>
{panels}
</div>'''

def question(num, title, statement, idea, code_html):
    return f'''<div class="question">
<div class="q-head"><span class="q-num">{num}</span><h4>{title}</h4></div>
<p class="statement">📋 <strong>المطلوب:</strong> {statement}</p>
<p class="idea">🧭 <strong>طريقة الحل:</strong> {idea}</p>
{code_html}
</div>'''

def section(sec_id, icon, title, intro, body_html):
    return f'''<section class="session" id="{sec_id}">
<h2>{icon} {title}</h2>
<p class="intro">{intro}</p>
{body_html}
</section>'''

sections_html = ""
toc_items = ""

def add(sec_id, icon, title, intro, body):
    global sections_html, toc_items
    sections_html += section(sec_id, icon, title, intro, body)
    toc_items += f'<li><a href="#{sec_id}">{icon} {title}</a></li>'

# ============================= SECTION A =============================
q1 = question(1, "Weekend Checker",
    "المستخدم بيدخل رقم اليوم من 1 لـ7 (1=الأحد، 2=الإثنين ... 7=السبت). لو الرقم اللي دخله 6 أو 7 اطبع Weekend، وغير كده اطبع Working Day.",
    "بناخد رقم اليوم من المستخدم، ونسأل: هل الرقم يساوي 6 أو يساوي 7؟ لو أي واحد فيهم صح يبقى Weekend، وغير كده Working Day. محتاجين شرطين فهنستخدم OR.",
    code_panel(
js='''let day = parseInt(prompt("ادخل رقم اليوم (1-7): "));

if (day === 6 || day === 7) {
    console.log("Weekend");
} else {
    console.log("Working Day");
}''',
py='''day = int(input("ادخل رقم اليوم (1-7): "))

if day == 6 or day == 7:
    print("Weekend")
else:
    print("Working Day")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int day;
    cout << "ادخل رقم اليوم (1-7): ";
    cin >> day;

    if (day == 6 || day == 7) {
        cout << "Weekend" << endl;
    } else {
        cout << "Working Day" << endl;
    }
    return 0;
}''')
)

q2 = question(2, "ATM",
    "المستخدم بيدخل الـ PIN، والرصيد، والمبلغ المطلوب سحبه. الـ PIN الصحيح هو 1234. لو الـ PIN صح: اطبع Success لو المبلغ أقل من أو يساوي الرصيد، وإلا اطبع Insufficient Balance. لو الـ PIN غلط اطبع Wrong PIN.",
    "الشرط ده متداخل (Nested): الأول لازم نتأكد إن الـ PIN صح. لو صح، ندخل جوه ونقارن المبلغ بالرصيد. لو الـ PIN غلط أصلاً، مش هنوصل حتى لمقارنة الرصيد.",
    code_panel(
js='''let pin = parseInt(prompt("ادخل الـ PIN: "));
let balance = parseFloat(prompt("ادخل الرصيد: "));
let amount = parseFloat(prompt("ادخل المبلغ المطلوب سحبه: "));

if (pin === 1234) {
    if (amount <= balance) {
        console.log("Success");
    } else {
        console.log("Insufficient Balance");
    }
} else {
    console.log("Wrong PIN");
}''',
py='''pin = int(input("ادخل الـ PIN: "))
balance = float(input("ادخل الرصيد: "))
amount = float(input("ادخل المبلغ المطلوب سحبه: "))

if pin == 1234:
    if amount <= balance:
        print("Success")
    else:
        print("Insufficient Balance")
else:
    print("Wrong PIN")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int pin;
    double balance, amount;
    cout << "ادخل الـ PIN: "; cin >> pin;
    cout << "ادخل الرصيد: "; cin >> balance;
    cout << "ادخل المبلغ المطلوب سحبه: "; cin >> amount;

    if (pin == 1234) {
        if (amount <= balance) {
            cout << "Success" << endl;
        } else {
            cout << "Insufficient Balance" << endl;
        }
    } else {
        cout << "Wrong PIN" << endl;
    }
    return 0;
}''')
)

q3 = question(3, "Student Admission",
    "المستخدم بيدخل الدرجة والسن ونتيجة امتحان الإنجليزي (1=ناجح, 0=راسب). الطالب يتقبل (Accepted) لو الدرجة 85 أو أكتر، والسن 18 أو أكتر، وناجح في الإنجليزي. غير كده Rejected.",
    "هنا لازم كل الشروط الثلاثة تتحقق مع بعض عشان الطالب يتقبل، فهنستخدم AND. لو شرط واحد بس غلط، النتيجة كلها هتبقى Rejected.",
    code_panel(
js='''let grade = parseFloat(prompt("الدرجة: "));
let age = parseInt(prompt("السن: "));
let english = parseInt(prompt("نتيجة الإنجليزي (1=ناجح, 0=راسب): "));

if (grade >= 85 && age >= 18 && english === 1) {
    console.log("Accepted");
} else {
    console.log("Rejected");
}''',
py='''grade = float(input("الدرجة: "))
age = int(input("السن: "))
english = int(input("نتيجة الإنجليزي (1=ناجح, 0=راسب): "))

if grade >= 85 and age >= 18 and english == 1:
    print("Accepted")
else:
    print("Rejected")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double grade; int age, english;
    cout << "الدرجة: "; cin >> grade;
    cout << "السن: "; cin >> age;
    cout << "نتيجة الإنجليزي (1=ناجح, 0=راسب): "; cin >> english;

    if (grade >= 85 && age >= 18 && english == 1) {
        cout << "Accepted" << endl;
    } else {
        cout << "Rejected" << endl;
    }
    return 0;
}''')
)

q4 = question(4, "Ternary Operator - Positive or Negative",
    "المستخدم بيدخل رقم. لو الرقم أكبر من أو يساوي صفر اطبع Positive، وغير كده اطبع Negative، باستخدام Ternary Operator فقط.",
    "ممنوع نستخدم if/else هنا، فبنكتب الشرط كله في سطر واحد بالشكل: condition ? valueIfTrue : valueIfFalse.",
    code_panel(
js='''let num = parseFloat(prompt("ادخل رقم: "));
console.log(num >= 0 ? "Positive" : "Negative");''',
py='''num = float(input("ادخل رقم: "))
print("Positive" if num >= 0 else "Negative")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double num;
    cout << "ادخل رقم: "; cin >> num;
    cout << (num >= 0 ? "Positive" : "Negative") << endl;
    return 0;
}''')
)

q5 = question("⭐", "Bonus - أكبر 3 أرقام بدون max()",
    "المستخدم بيدخل 3 أرقام، والمطلوب نطبع أكبر رقم فيهم من غير ما نستخدم max() أو أي دالة جاهزة، باستخدام if و else if و else فقط.",
    "متبصش على الثلاثة أرقام مرة واحدة. قارن الأول بالتاني: مين الأكبر بينهم؟ خد الأكبر وقارنه بالتالت. اللي يفضل في الآخر هو الأكبر على الإطلاق.",
    code_panel(
js='''let a = parseFloat(prompt("الرقم الأول: "));
let b = parseFloat(prompt("الرقم الثاني: "));
let c = parseFloat(prompt("الرقم الثالث: "));
let biggest;

if (a >= b) {
    if (a >= c) { biggest = a; } else { biggest = c; }
} else {
    if (b >= c) { biggest = b; } else { biggest = c; }
}
console.log("أكبر رقم هو: " + biggest);''',
py='''a = float(input("الرقم الأول: "))
b = float(input("الرقم الثاني: "))
c = float(input("الرقم الثالث: "))

if a >= b:
    biggest = a if a >= c else c
else:
    biggest = b if b >= c else c

print("أكبر رقم هو:", biggest)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double a, b, c, biggest;
    cout << "الرقم الأول: "; cin >> a;
    cout << "الرقم الثاني: "; cin >> b;
    cout << "الرقم الثالث: "; cin >> c;

    if (a >= b) {
        if (a >= c) biggest = a; else biggest = c;
    } else {
        if (b >= c) biggest = b; else biggest = c;
    }
    cout << "أكبر رقم هو: " << biggest << endl;
    return 0;
}''')
)

add("sessionA", "🔰", "الشروط الأساسية: Weekend – ATM – Student Admission – Ternary – Bonus",
    "دي أول اسيمنت بعتها، بتتمرن فيها على if / else / else if / && / || و Ternary Operator. كل الأسئلة اتكررت مرتين في اللي بعتهولي فحليتها مرة واحدة كافية للاتنين.",
    q1+q2+q3+q4+q5)

# ============================= SECTION B: number systems =============================
conv_intro = '''الطريقة إنك تفهم "قيمة كل خانة" مش تحفظ. في Binary كل خانة قيمتها قوة من 2 (2⁰, 2¹, 2², ...) بنعدّها من أقصى اليمين. في Hexadecimal كل رمز (رقم أو حرف) بيتحول لـ 4 bits بالظبط حسب الجدول: A=1010, B=1011, C=1100, D=1101, E=1110, F=1111.'''

table1 = '''<table class="ans-table">
<tr><th>Binary</th><th>Decimal</th></tr>
<tr><td>1011</td><td>11</td></tr>
<tr><td>11010</td><td>26</td></tr>
<tr><td>100101</td><td>37</td></tr>
<tr><td>11111111</td><td>255</td></tr>
<tr><td>010010</td><td>18</td></tr>
</table>
<table class="ans-table">
<tr><th>Decimal</th><th>Binary</th></tr>
<tr><td>9</td><td>1001</td></tr>
<tr><td>25</td><td>11001</td></tr>
<tr><td>37</td><td>100101</td></tr>
<tr><td>128</td><td>10000000</td></tr>
<tr><td>255</td><td>11111111</td></tr>
</table>
<table class="ans-table">
<tr><th>Hexadecimal</th><th>Binary</th></tr>
<tr><td>A3</td><td>1010 0011</td></tr>
<tr><td>2F</td><td>0010 1111</td></tr>
<tr><td>7B</td><td>0111 1011</td></tr>
<tr><td>1C4</td><td>0001 1100 0100</td></tr>
<tr><td>FF</td><td>1111 1111</td></tr>
</table>'''

table2 = '''<table class="ans-table">
<tr><th>Binary</th><th>Decimal</th></tr>
<tr><td>10101</td><td>21</td></tr>
<tr><td>100110</td><td>38</td></tr>
<tr><td>11100</td><td>28</td></tr>
<tr><td>110011</td><td>51</td></tr>
<tr><td>10000001</td><td>129</td></tr>
</table>
<table class="ans-table">
<tr><th>Decimal</th><th>Binary</th></tr>
<tr><td>11</td><td>1011</td></tr>
<tr><td>18</td><td>10010</td></tr>
<tr><td>42</td><td>101010</td></tr>
<tr><td>73</td><td>1001001</td></tr>
<tr><td>100</td><td>1100100</td></tr>
</table>
<table class="ans-table">
<tr><th>Hexadecimal</th><th>Binary</th></tr>
<tr><td>B2</td><td>1011 0010</td></tr>
<tr><td>4D</td><td>0100 1101</td></tr>
<tr><td>9A</td><td>1001 1010</td></tr>
<tr><td>3F</td><td>0011 1111</td></tr>
<tr><td>E1</td><td>1110 0001</td></tr>
</table>'''

conv_code = question("💻", "تحقق من الإجابات بالكود (اختياري)",
    "بعد ما نحسب التحويلات بإيدنا في الجدول اللي فوق، ممكن كمان نتأكد من النتيجة باستخدام دوال جاهزة في كل لغة.",
    "تقدر تتأكد من أي تحويل بالدوال الجاهزة للغة، بس المهم الأول إنك تعرف تحسبها بإيدك زي فوق.",
    code_panel(
js='''// Binary -> Decimal
console.log(parseInt("1011", 2));      // 11

// Decimal -> Binary
console.log((37).toString(2));         // 100101

// Hex -> Binary
let hexNum = parseInt("A3", 16);
console.log(hexNum.toString(2));       // 10100011''',
py='''# Binary -> Decimal
print(int("1011", 2))          # 11

# Decimal -> Binary
print(bin(37)[2:])             # 100101

# Hex -> Binary
hex_num = int("A3", 16)
print(bin(hex_num)[2:])        # 10100011''',
cpp='''#include <iostream>
#include <bitset>
using namespace std;

int main() {
    // Binary -> Decimal
    int decVal = stoi("1011", nullptr, 2);
    cout << decVal << endl; // 11

    // Decimal -> Binary
    cout << bitset<8>(37) << endl; // 00100101

    // Hex -> Binary
    int hexVal = stoi("A3", nullptr, 16);
    cout << bitset<8>(hexVal) << endl; // 10100011
    return 0;
}''')
)

add("sessionB", "🔢", "أنظمة العد: Binary – Decimal – Hexadecimal",
    conv_intro,
    "<h3>المجموعة الأولى</h3>"+table1+"<h3>المجموعة الثانية (تدريبات إضافية)</h3>"+table2+conv_code)

# ============================= SECTION C: Variables =============================
var_q = question(1, "تعريف وطباعة أنواع البيانات",
    "في كل لغة (JS/Python/C++): عرّف متغير من نوع String، ومتغير Integer، ومتغير Float، ومتغير Boolean، واطبع الأربعة كلهم.",
    "كل لغة عندها طريقتها في تعريف المتغير. المهم إنك تختار اسم واضح، وتحدد نوع البيانات المناسب لكل قيمة (نص - رقم صحيح - رقم عشري - Boolean).",
    code_panel(
js='''let studentName = "Ahmed";   // String
let studentAge = 20;          // Integer
let studentGpa = 3.75;        // Float
let isStudent = true;         // Boolean

console.log(studentName);
console.log(studentAge);
console.log(studentGpa);
console.log(isStudent);''',
py='''student_name = "Ahmed"     # String
student_age = 20            # Integer
student_gpa = 3.75          # Float
is_student = True           # Boolean

print(student_name)
print(student_age)
print(student_gpa)
print(is_student)''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string studentName = "Ahmed"; // String
    int studentAge = 20;          // Integer
    float studentGpa = 3.75;      // Float
    bool isStudent = true;        // Boolean

    cout << studentName << endl;
    cout << studentAge << endl;
    cout << studentGpa << endl;
    cout << isStudent << endl;
    return 0;
}''')
)

add("sessionC", "📦", "Assignment 1 – Variables (أنواع البيانات)",
    "المطلوب بسيط: تعريف متغير من كل نوع (String, Integer, Float, Boolean) وطباعته. ركّز على اختيار أسماء منطقية وعدم البدء برقم أو استخدام مسافات.",
    var_q)

# ============================= SECTION D: arithmetic (split) =============================
d1 = question(1, "جمع رقمين",
    "عرّف متغيرين يحتويان على رقمين، احسب ناتج الجمع بينهما، واطبع الناتج.",
    "بسيطة: نعرّف رقمين، ونجمعهم بـ +، ونطبع الناتج مباشرة.",
    code_panel(
js='''let num1 = 15, num2 = 20;
console.log("Sum:", num1 + num2);''',
py='''num1, num2 = 15, 20
print("Sum:", num1 + num2)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int num1 = 15, num2 = 20;
    cout << "Sum: " << num1 + num2 << endl;
    return 0;
}''')
)

d2 = question(2, "العمليات الحسابية",
    "عرّف متغيرين يحتويان على رقمين، احسب الجمع والطرح والضرب والقسمة بينهما، واطبع جميع النتائج.",
    "نفس الرقمين هنستخدمهم أربع مرات مع عمليات مختلفة (+ - * /) ونطبع كل نتيجة لوحدها.",
    code_panel(
js='''let x = 12, y = 4;
console.log("Addition:", x + y);
console.log("Subtraction:", x - y);
console.log("Multiplication:", x * y);
console.log("Division:", x / y);''',
py='''x, y = 12, 4
print("Addition:", x + y)
print("Subtraction:", x - y)
print("Multiplication:", x * y)
print("Division:", x / y)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int x = 12, y = 4;
    cout << "Addition: " << x + y << endl;
    cout << "Subtraction: " << x - y << endl;
    cout << "Multiplication: " << x * y << endl;
    cout << "Division: " << (float)x / y << endl;
    return 0;
}''')
)

d3 = question(3, "حساب المتوسط",
    "عرّف 3 متغيرات تمثل درجات طالب، احسب متوسط الدرجات، واطبع المتوسط.",
    "نجمع الدرجات التلاتة مع بعض، ونقسم المجموع على 3 عشان نجيب المتوسط.",
    code_panel(
js='''let g1 = 80, g2 = 90, g3 = 70;
let average = (g1 + g2 + g3) / 3;
console.log("Average:", average);''',
py='''g1, g2, g3 = 80, 90, 70
average = (g1 + g2 + g3) / 3
print("Average:", average)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int g1 = 80, g2 = 90, g3 = 70;
    float average = (g1 + g2 + g3) / 3.0;
    cout << "Average: " << average << endl;
    return 0;
}''')
)

d4 = question(4, "بيانات طالب",
    "عرّف المتغيرات التالية: اسم الطالب، العمر، المدينة، واطبع جميع البيانات.",
    "3 متغيرات بسيطة بأنواع مختلفة (نص ورقم ونص)، ونطبعهم كلهم بترتيب واضح.",
    code_panel(
js='''let name = "Ahmed", age = 20, city = "Cairo";
console.log("Name:", name);
console.log("Age:", age);
console.log("City:", city);''',
py='''name, age, city = "Ahmed", 20, "Cairo"
print("Name:", name)
print("Age:", age)
print("City:", city)''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "Ahmed"; int age = 20; string city = "Cairo";
    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "City: " << city << endl;
    return 0;
}''')
)

d5 = question(5, "حساب سعر منتج",
    "عرّف متغيرًا لسعر المنتج، وآخر للكمية، احسب إجمالي السعر، واطبع الناتج.",
    "إجمالي السعر = السعر × الكمية، عملية ضرب بسيطة.",
    code_panel(
js='''let price = 50, quantity = 3;
let total = price * quantity;
console.log("Total Price:", total);''',
py='''price, quantity = 50, 3
total = price * quantity
print("Total Price:", total)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double price = 50, quantity = 3;
    double total = price * quantity;
    cout << "Total Price: " << total << endl;
    return 0;
}''')
)

add("sessionD", "➗", "العمليات الحسابية (5 تدريبات)",
    "كل تدريب هنا بيتمرن على المتغيرات وعمليات (+ - * / %) بس. القيم هنا معرّفة جاهزة في الكود، مش من المستخدم، زي ما طلب السؤال.",
    d1+d2+d3+d4+d5)

# ============================= SECTION E: MCQ =============================
mcq_html = '''<table class="ans-table mcq-table">
<tr><th>السؤال</th><th>الإجابة</th><th>السبب باختصار</th></tr>
<tr><td>1) (10 > 5) and (7 < 9)</td><td>a) True</td><td>الشرطان صح، وAND محتاجة الاتنين صح</td></tr>
<tr><td>2) (8 == 8) and (3 > 10)</td><td>b) False</td><td>الشرط التاني غلط، فـ AND كله بيبقى False</td></tr>
<tr><td>3) (15 != 10) or (2 > 5)</td><td>a) True</td><td>الشرط الأول صح، وOR تكفي شرط واحد صح</td></tr>
<tr><td>4) (4 > 8) or (6 == 6)</td><td>a) True</td><td>الشرط التاني صح</td></tr>
<tr><td>5) not (10 < 5)</td><td>a) True</td><td>(10 < 5) غلط، وnot بتقلبها لـ True</td></tr>
<tr><td>6) (20 >= 20) and not (3 > 7)</td><td>a) True</td><td>الشرط الأول True، و(3>7) غلط فـ not (False) = True</td></tr>
<tr><td>7) (5 == 5) and (8 != 8)</td><td>b) False</td><td>(8 != 8) غلط لأنهم متساويين</td></tr>
<tr><td>8) (12 < 20) or (15 < 10)</td><td>a) True</td><td>الشرط الأول صح وكفاية مع OR</td></tr>
<tr><td>9) not ((7 > 3) and (2 > 5))</td><td>a) True</td><td>الداخل: True and False = False، وnot False = True</td></tr>
<tr><td>10) ((10 % 2) == 0) and (9 > 3)</td><td>a) True</td><td>10 % 2 = 0 فالشرط الأول صح، والتاني صح كمان</td></tr>
<tr><td>Bonus) ("10" == 10) && (5 > 2)</td><td>a) True</td><td>== في JS بتحول النوع (Type Coercion) فـ "10" == 10 تبقى True</td></tr>
<tr><td>Bonus) ("10" === 10) || (8 < 3)</td><td>b) False</td><td>=== بتقارن النوع كمان، فـ String لا تساوي Number، والشرط التاني غلط</td></tr>
</table>'''

add("sessionE", "❓", "MCQ – Comparison & Logical Operators",
    "أسئلة اختيار من متعدد، مفيش كود هنا، بس تفكير منطقي في كل شرط لوحده.",
    mcq_html)

# ============================= SECTION F: Assignment 2 (split) =============================
f1 = question(1, "Variables",
    "أنشئ متغير studentName وخزّن فيه اسمك، studentAge لعمرك، isStudent وخزّن فيه True، واطبع الثلاثة بنفس شكل المثال.",
    "3 متغيرات بأنواع مختلفة، وطباعة كل واحد بليبل واضح قبله.",
    code_panel(
js='''let studentName = "Ahmed";
let studentAge = 20;
let isStudent = true;

console.log("Name:", studentName);
console.log("Age:", studentAge);
console.log("Student:", isStudent);''',
py='''studentName = "Ahmed"
studentAge = 20
isStudent = True

print("Name:", studentName)
print("Age:", studentAge)
print("Student:", isStudent)''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string studentName = "Ahmed";
    int studentAge = 20;
    bool isStudent = true;

    cout << "Name: " << studentName << endl;
    cout << "Age: " << studentAge << endl;
    cout << "Student: " << isStudent << endl;
    return 0;
}''')
)

f2 = question(2, "Assignment Operators",
    "عندك score = 50. استخدم Assignment Operators بالترتيب: أضف 20، اطرح 10، اضرب في 2، اقسم على 4، ثم اطبع القيمة النهائية.",
    "بنطبق كل عملية على نفس المتغير بالترتيب اللي اتطلب بالظبط، زي += ثم -= ثم *= ثم /=.",
    code_panel(
js='''let score = 50;
score += 20;
score -= 10;
score *= 2;
score /= 4;
console.log("Final score:", score);''',
py='''score = 50
score += 20
score -= 10
score *= 2
score /= 4
print("Final score:", score)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double score = 50;
    score += 20;
    score -= 10;
    score *= 2;
    score /= 4;
    cout << "Final score: " << score << endl;
    return 0;
}''')
)

f3 = question(3, "Logical Operators",
    "عندك grade = 85 و passedTest = True. اطبع نتائج الشروط: grade > 80 and passedTest / grade > 90 or passedTest / not passedTest.",
    "كل شرط بيتقيّم لوحده ونطبع نتيجته True/False.",
    code_panel(
js='''let grade = 85;
let passedTest = true;

console.log(grade > 80 && passedTest);
console.log(grade > 90 || passedTest);
console.log(!passedTest);''',
py='''grade = 85
passedTest = True

print(grade > 80 and passedTest)
print(grade > 90 or passedTest)
print(not passedTest)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int grade = 85;
    bool passedTest = true;

    cout << (grade > 80 && passedTest) << endl;
    cout << (grade > 90 || passedTest) << endl;
    cout << (!passedTest) << endl;
    return 0;
}''')
)

f4 = question(4, "Even or Odd",
    "عندك number = 17. استخدم معامل الباقي % عشان تحدد هل الرقم Even أو Odd، واطبع النتيجة.",
    "لو number % 2 ساوى 0 يبقى الرقم زوجي، غير كده فردي.",
    code_panel(
js='''let number = 17;
if (number % 2 === 0) {
    console.log("Even");
} else {
    console.log("Odd");
}''',
py='''number = 17
if number % 2 == 0:
    print("Even")
else:
    print("Odd")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int number = 17;
    if (number % 2 == 0) cout << "Even" << endl;
    else cout << "Odd" << endl;
    return 0;
}''')
)

f5 = question(5, "Small Challenge – Wallet",
    "عندك wallet=100، اشترِ منتج سعره 35 باستخدام Assignment Operator مناسب، اطبع المبلغ المتبقي، وتحقق هل المتبقي أكبر من أو يساوي 50 واطبع نتيجة المقارنة.",
    "بنستخدم Assignment Operator (-=) عشان نطرح سعر المنتج من المحفظة، وبعدين نستخدم مقارنة (>=) عشان نتأكد هل فاضل فلوس كفاية لمنتج تاني.",
    code_panel(
js='''let wallet = 100;
wallet -= 35;
console.log("Remaining Money:", wallet);
console.log("Can Buy Another Product:", wallet >= 50);''',
py='''wallet = 100
wallet -= 35
print("Remaining Money:", wallet)
print("Can Buy Another Product:", wallet >= 50)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double wallet = 100;
    wallet -= 35;
    cout << "Remaining Money: " << wallet << endl;
    cout << "Can Buy Another Product: " << (wallet >= 50) << endl;
    return 0;
}''')
)

f_short = '''<div class="question">
<div class="q-head"><span class="q-num">📝</span><h4>Part 4 – أسئلة قصيرة</h4></div>
<p class="idea"><strong>1) وظيفة معامل %؟</strong><br>
بيرجع "باقي القسمة" مش ناتج القسمة نفسه. بنستخدمه كتير عشان نعرف الرقم زوجي أو فردي (لو الباقي 0 يبقى زوجي).</p>
<p class="idea"><strong>2) الفرق بين == و === في JavaScript؟</strong><br>
== بتقارن القيمة بس وبتحول النوع تلقائي (Type Coercion)، يعني "10" == 10 بترجع true.
أما === بتقارن القيمة والنوع مع بعض، فـ "10" === 10 بترجع false لأن واحد String والتاني Number.</p>
</div>'''

add("sessionF", "🧮", "Assignment 2 – Variables & Operators",
    "تدريب على المتغيرات، Assignment Operators، Logical Operators، ومعامل الباقي %. كل سؤال هنا مستقل بكوده الخاص عشان يسهل عليك تتابعه.",
    f1+f2+f3+f4+f5+f_short)

# ============================= SECTION G: Q3-Q8 + Bonus (split) =============================
g3 = question(3, "Age Category",
    "عندك متغير age. لو أقل من 13 اطبع Child، لو من 13 لأقل من 18 اطبع Teen، لو 18 أو أكتر اطبع Adult.",
    "سلسلة else if بترتيب تصاعدي: نبدأ بأصغر شرط (أقل من 13) وننزل بالترتيب.",
    code_panel(
js='''let age = 15;

if (age < 13) {
    console.log("Child");
} else if (age < 18) {
    console.log("Teen");
} else {
    console.log("Adult");
}''',
py='''age = 15

if age < 13:
    print("Child")
elif age < 18:
    print("Teen")
else:
    print("Adult")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int age = 15;

    if (age < 13) cout << "Child" << endl;
    else if (age < 18) cout << "Teen" << endl;
    else cout << "Adult" << endl;
    return 0;
}''')
)

g4 = question(4, "Student Grade System",
    "عندك متغير score. حدد التقدير: 90+ Excellent، 80+ Very Good، 70+ Good، 60+ Pass، أقل من 60 Fail.",
    "ابدأ المقارنة من أعلى درجة لأسفل بـ else if، عشان أول شرط يتحقق هو اللي هيطبع.",
    code_panel(
js='''let score = 77;

if (score >= 90) {
    console.log("Excellent");
} else if (score >= 80) {
    console.log("Very Good");
} else if (score >= 70) {
    console.log("Good");
} else if (score >= 60) {
    console.log("Pass");
} else {
    console.log("Fail");
}''',
py='''score = 77

if score >= 90:
    print("Excellent")
elif score >= 80:
    print("Very Good")
elif score >= 70:
    print("Good")
elif score >= 60:
    print("Pass")
else:
    print("Fail")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int score = 77;

    if (score >= 90) cout << "Excellent" << endl;
    else if (score >= 80) cout << "Very Good" << endl;
    else if (score >= 70) cout << "Good" << endl;
    else if (score >= 60) cout << "Pass" << endl;
    else cout << "Fail" << endl;
    return 0;
}''')
)

g5 = question(5, "Login System",
    "عندك username و password صح مخزنين، وعندك بيانات أدخلها المستخدم. لو الاتنين مطابقين اطبع Login Successful، غير كده Invalid Username or Password.",
    "شرط واحد بس محتاج الاتنين يتطابقوا مع بعض، فهنستخدم AND.",
    code_panel(
js='''let username = "admin", password = "1234";
let inputUser = "admin", inputPass = "1234";

if (inputUser === username && inputPass === password) {
    console.log("Login Successful");
} else {
    console.log("Invalid Username or Password");
}''',
py='''username, password = "admin", "1234"
input_user, input_pass = "admin", "1234"

if input_user == username and input_pass == password:
    print("Login Successful")
else:
    print("Invalid Username or Password")''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string username = "admin", password = "1234";
    string inputUser = "admin", inputPass = "1234";

    if (inputUser == username && inputPass == password) {
        cout << "Login Successful" << endl;
    } else {
        cout << "Invalid Username or Password" << endl;
    }
    return 0;
}''')
)

g6 = question(6, "Driving License Checker",
    "عندك age و hasLicense. لو السن 18 أو أكتر ومعاه رخصة اطبع You Can Drive، غير كده You Cannot Drive.",
    "الشرطان لازم يتحققوا مع بعض عشان الشخص يقدر يسوق، فهنستخدم AND.",
    code_panel(
js='''let driverAge = 20, hasLicense = true;

if (driverAge >= 18 && hasLicense) {
    console.log("You Can Drive");
} else {
    console.log("You Cannot Drive");
}''',
py='''driver_age, has_license = 20, True

if driver_age >= 18 and has_license:
    print("You Can Drive")
else:
    print("You Cannot Drive")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int driverAge = 20; bool hasLicense = true;

    if (driverAge >= 18 && hasLicense) cout << "You Can Drive" << endl;
    else cout << "You Cannot Drive" << endl;
    return 0;
}''')
)

g7 = question(7, "Discount System",
    "عندك purchaseAmount و isVip. لو العميل VIP أو المشتريات >= 1000 اطبع Discount Applied، غير كده No Discount.",
    "شرط واحد بس كفاية عشان يستحق الخصم، فهنستخدم OR.",
    code_panel(
js='''let purchaseAmount = 1200, isVip = false;

if (isVip || purchaseAmount >= 1000) {
    console.log("Discount Applied");
} else {
    console.log("No Discount");
}''',
py='''purchase_amount, is_vip = 1200, False

if is_vip or purchase_amount >= 1000:
    print("Discount Applied")
else:
    print("No Discount")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double purchaseAmount = 1200; bool isVip = false;

    if (isVip || purchaseAmount >= 1000) cout << "Discount Applied" << endl;
    else cout << "No Discount" << endl;
    return 0;
}''')
)

g8 = question(8, "Traffic Light System",
    "عندك lightColor بقيمة Green أو Yellow أو Red. اطبع Go لو Green، Slow Down لو Yellow، Stop لو Red، وInvalid Color لأي قيمة تانية.",
    "سلسلة if / else if / else، وآخر else بيغطي أي قيمة مش متوقعة.",
    code_panel(
js='''let lightColor = "Yellow";

if (lightColor === "Green") {
    console.log("Go");
} else if (lightColor === "Yellow") {
    console.log("Slow Down");
} else if (lightColor === "Red") {
    console.log("Stop");
} else {
    console.log("Invalid Color");
}''',
py='''light_color = "Yellow"

if light_color == "Green":
    print("Go")
elif light_color == "Yellow":
    print("Slow Down")
elif light_color == "Red":
    print("Stop")
else:
    print("Invalid Color")''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string lightColor = "Yellow";

    if (lightColor == "Green") cout << "Go" << endl;
    else if (lightColor == "Yellow") cout << "Slow Down" << endl;
    else if (lightColor == "Red") cout << "Stop" << endl;
    else cout << "Invalid Color" << endl;
    return 0;
}''')
)

g_bonus = question("⭐", "Bonus – Welcome Admin",
    "عندك username و password و age. لو البيانات صحيحة (admin/1234) والسن 18 أو أكتر اطبع Welcome Admin، غير كده Access Denied.",
    "ثلاث شروط مع بعض بـ AND: اسم المستخدم صح، كلمة السر صح، والسن كفاية.",
    code_panel(
js='''let bUser = "admin", bPass = "1234", bAge = 20;

if (bUser === "admin" && bPass === "1234" && bAge >= 18) {
    console.log("Welcome Admin");
} else {
    console.log("Access Denied");
}''',
py='''b_user, b_pass, b_age = "admin", "1234", 20

if b_user == "admin" and b_pass == "1234" and b_age >= 18:
    print("Welcome Admin")
else:
    print("Access Denied")''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string bUser = "admin", bPass = "1234"; int bAge = 20;

    if (bUser == "admin" && bPass == "1234" && bAge >= 18) {
        cout << "Welcome Admin" << endl;
    } else {
        cout << "Access Denied" << endl;
    }
    return 0;
}''')
)

add("sessionG", "🚦", "Age – Grade – Login – License – Discount – Traffic Light",
    "ست تدريبات + Bonus على if/else if/else وLogical Operators، كل سؤال بقيمه الخاصة عشان تقدر تجرب Test Cases مختلفة بسهولة (غيّر القيمة وشغّل تاني).",
    g3+g4+g5+g6+g7+g8+g_bonus)

# ============================= SECTION H: Q7-Q12 (split) =============================
h7 = question(7, "Valid Number",
    "عندك متغير number. تحقق هل قيمته بين 1 و100 (شامل الطرفين) باستخدام Logical Operators. لو داخل النطاق اطبع Valid Number، غير كده Invalid Number.",
    "شرطان لازم يتحققوا مع بعض: number >= 1 و number <= 100، فهنستخدم AND.",
    code_panel(
js='''let number = 55;

if (number >= 1 && number <= 100) {
    console.log("Valid Number");
} else {
    console.log("Invalid Number");
}''',
py='''number = 55

if number >= 1 and number <= 100:
    print("Valid Number")
else:
    print("Invalid Number")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int number = 55;

    if (number >= 1 && number <= 100) cout << "Valid Number" << endl;
    else cout << "Invalid Number" << endl;
    return 0;
}''')
)

h8 = question(8, "FizzBuzz",
    "عندك متغير number. لو يقبل القسمة على 3 و5 معًا اطبع FizzBuzz، لو على 3 بس اطبع Fizz، لو على 5 بس اطبع Buzz، غير كده اطبع الرقم نفسه.",
    "لازم نتحقق من حالة القسمة على الاتنين مع بعض الأول (وإلا هيدخل في شرط Fizz أو Buzz بالغلط)، وبعدين كل حالة لوحدها.",
    code_panel(
js='''let number = 55;

if (number % 3 === 0 && number % 5 === 0) {
    console.log("FizzBuzz");
} else if (number % 3 === 0) {
    console.log("Fizz");
} else if (number % 5 === 0) {
    console.log("Buzz");
} else {
    console.log(number);
}''',
py='''number = 55

if number % 3 == 0 and number % 5 == 0:
    print("FizzBuzz")
elif number % 3 == 0:
    print("Fizz")
elif number % 5 == 0:
    print("Buzz")
else:
    print(number)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int number = 55;

    if (number % 3 == 0 && number % 5 == 0) cout << "FizzBuzz" << endl;
    else if (number % 3 == 0) cout << "Fizz" << endl;
    else if (number % 5 == 0) cout << "Buzz" << endl;
    else cout << number << endl;
    return 0;
}''')
)

h9 = question(9, "Adult or Minor (Ternary)",
    "عندك متغير age. باستخدام Ternary Operator فقط: لو 18 أو أكتر اطبع Adult، غير كده اطبع Minor.",
    "شرط بسيط في سطر واحد: condition ? Adult : Minor.",
    code_panel(
js='''let age = 20;
console.log(age >= 18 ? "Adult" : "Minor");''',
py='''age = 20
print("Adult" if age >= 18 else "Minor")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int age = 20;
    cout << (age >= 18 ? "Adult" : "Minor") << endl;
    return 0;
}''')
)

h10 = question(10, "Even or Odd (Ternary)",
    "عندك متغير number. باستخدام Ternary Operator فقط حدد هل هو Even أو Odd.",
    "نستخدم % 2 جوه الـ Ternary مباشرة.",
    code_panel(
js='''let number = 55;
console.log(number % 2 === 0 ? "Even" : "Odd");''',
py='''number = 55
print("Even" if number % 2 == 0 else "Odd")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int number = 55;
    cout << (number % 2 == 0 ? "Even" : "Odd") << endl;
    return 0;
}''')
)

h11 = question(11, "Pass or Fail (Ternary)",
    "عندك متغير score. باستخدام Ternary Operator فقط: لو 50 أو أكتر اطبع Pass، غير كده اطبع Fail.",
    "نفس فكرة Ternary، بس الشرط هنا على الدرجة.",
    code_panel(
js='''let score = 65;
console.log(score >= 50 ? "Pass" : "Fail");''',
py='''score = 65
print("Pass" if score >= 50 else "Fail")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int score = 65;
    cout << (score >= 50 ? "Pass" : "Fail") << endl;
    return 0;
}''')
)

h12 = question(12, "Hot or Cold (Challenge, Ternary)",
    "عندك متغير temperature. باستخدام Ternary Operator فقط: لو أكبر من 30 اطبع Hot، غير كده اطبع Cold.",
    "نفس النمط بالظبط، بس على درجة الحرارة.",
    code_panel(
js='''let temperature = 35;
console.log(temperature > 30 ? "Hot" : "Cold");''',
py='''temperature = 35
print("Hot" if temperature > 30 else "Cold")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int temperature = 35;
    cout << (temperature > 30 ? "Hot" : "Cold") << endl;
    return 0;
}''')
)

add("sessionH", "🎯", "If / Else If / Else + Ternary Operator (Q7-Q12)",
    "لاحظ الفرق: Q7 وQ8 بتتحل بـ if الكاملة، لكن Q9 لحد Q12 المطلوب Ternary بس - سطر واحد لكل سؤال.",
    h7+h8+h9+h10+h11+h12)

# ============================= SECTION I: Nested If & Switch (split) =============================
i1 = question(1, "ATM System (Nested If)",
    "اطلب PIN وBalance وWithdraw Amount. لو الـ PIN = 1111 ادخل شرط تاني: لو المبلغ أقل من أو يساوي الرصيد اطبع Withdrawal Successful والرصيد الجديد، غير كده Insufficient Balance. لو الـ PIN غلط اطبع Invalid PIN.",
    "الشرط الخارجي (الـ PIN) هو البوابة. لازم يتحقق الأول عشان تدخل تشوف شرط الرصيد الجواني.",
    code_panel(
js='''let pin = 1111, balance = 500, withdraw = 300;

if (pin === 1111) {
    if (withdraw <= balance) {
        console.log("Withdrawal Successful");
        console.log("New Balance:", balance - withdraw);
    } else {
        console.log("Insufficient Balance");
    }
} else {
    console.log("Invalid PIN");
}''',
py='''pin, balance, withdraw = 1111, 500, 300

if pin == 1111:
    if withdraw <= balance:
        print("Withdrawal Successful")
        print("New Balance:", balance - withdraw)
    else:
        print("Insufficient Balance")
else:
    print("Invalid PIN")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int pin = 1111; double balance = 500, withdraw = 300;

    if (pin == 1111) {
        if (withdraw <= balance) {
            cout << "Withdrawal Successful" << endl;
            cout << "New Balance: " << balance - withdraw << endl;
        } else {
            cout << "Insufficient Balance" << endl;
        }
    } else {
        cout << "Invalid PIN" << endl;
    }
    return 0;
}''')
)

i2 = question(2, "Scholarship (Nested If)",
    "اطلب GPA وAttendance. لو GPA >= 3 ادخل شرط تاني: لو نسبة الحضور >= 80 اطبع Scholarship Accepted، غير كده Attendance Is Low. لو GPA أقل من 3 اطبع GPA Is Too Low.",
    "برضو بوابة: أول حاجة نتأكد إن الـ GPA كويس، وبعدين ندخل نتأكد من الحضور.",
    code_panel(
js='''let gpa = 3.5, attendance = 85;

if (gpa >= 3) {
    if (attendance >= 80) {
        console.log("Scholarship Accepted");
    } else {
        console.log("Attendance Is Low");
    }
} else {
    console.log("GPA Is Too Low");
}''',
py='''gpa, attendance = 3.5, 85

if gpa >= 3:
    if attendance >= 80:
        print("Scholarship Accepted")
    else:
        print("Attendance Is Low")
else:
    print("GPA Is Too Low")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    double gpa = 3.5; int attendance = 85;

    if (gpa >= 3) {
        if (attendance >= 80) cout << "Scholarship Accepted" << endl;
        else cout << "Attendance Is Low" << endl;
    } else {
        cout << "GPA Is Too Low" << endl;
    }
    return 0;
}''')
)

i3 = question(3, "Driving License (Nested If)",
    "اطلب Age وDriving Test Result (yes/no). لو العمر >= 18 ادخل شرط تاني: لو النتيجة yes اطبع License Approved، غير كده Failed Driving Test. لو العمر أقل من 18 اطبع Under Age.",
    "نفس نمط الشروط المتداخلة: بوابة السن الأول، وبعدين نتيجة الاختبار.",
    code_panel(
js='''let age = 20, testResult = "yes";

if (age >= 18) {
    if (testResult === "yes") {
        console.log("License Approved");
    } else {
        console.log("Failed Driving Test");
    }
} else {
    console.log("Under Age");
}''',
py='''age, test_result = 20, "yes"

if age >= 18:
    if test_result == "yes":
        print("License Approved")
    else:
        print("Failed Driving Test")
else:
    print("Under Age")''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 20; string testResult = "yes";

    if (age >= 18) {
        if (testResult == "yes") cout << "License Approved" << endl;
        else cout << "Failed Driving Test" << endl;
    } else {
        cout << "Under Age" << endl;
    }
    return 0;
}''')
)

i4 = question(4, "Days Of Week (Switch / Match-Case)",
    "اطلب رقم من 1 لـ7 واطبع اسم اليوم المقابل باستخدام Switch في JS/C++ وmatch-case في Python.",
    "بدل ما نكتب سلسلة طويلة من else if لكل رقم، الـ Switch/match بيرتب الحالات بشكل أوضح.",
    code_panel(
js='''let dayNum = 3;

switch (dayNum) {
    case 1: console.log("Sunday"); break;
    case 2: console.log("Monday"); break;
    case 3: console.log("Tuesday"); break;
    case 4: console.log("Wednesday"); break;
    case 5: console.log("Thursday"); break;
    case 6: console.log("Friday"); break;
    case 7: console.log("Saturday"); break;
    default: console.log("Invalid Day");
}''',
py='''day_num = 3

match day_num:
    case 1: print("Sunday")
    case 2: print("Monday")
    case 3: print("Tuesday")
    case 4: print("Wednesday")
    case 5: print("Thursday")
    case 6: print("Friday")
    case 7: print("Saturday")
    case _: print("Invalid Day")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int dayNum = 3;

    switch (dayNum) {
        case 1: cout << "Sunday" << endl; break;
        case 2: cout << "Monday" << endl; break;
        case 3: cout << "Tuesday" << endl; break;
        case 4: cout << "Wednesday" << endl; break;
        case 5: cout << "Thursday" << endl; break;
        case 6: cout << "Friday" << endl; break;
        case 7: cout << "Saturday" << endl; break;
        default: cout << "Invalid Day" << endl;
    }
    return 0;
}''')
)

i5 = question(5, "Months (Switch / Match-Case)",
    "اطلب رقم شهر من 1 لـ12 واطبع اسم الشهر باستخدام Switch في JS/C++ وmatch-case في Python.",
    "نفس فكرة الأيام بالظبط، بس بعدد حالات أكبر (12 شهر).",
    code_panel(
js='''let monthNum = 5;

switch (monthNum) {
    case 1: console.log("January"); break;
    case 2: console.log("February"); break;
    case 3: console.log("March"); break;
    case 4: console.log("April"); break;
    case 5: console.log("May"); break;
    case 6: console.log("June"); break;
    case 7: console.log("July"); break;
    case 8: console.log("August"); break;
    case 9: console.log("September"); break;
    case 10: console.log("October"); break;
    case 11: console.log("November"); break;
    case 12: console.log("December"); break;
    default: console.log("Invalid Month");
}''',
py='''month_num = 5

match month_num:
    case 1: print("January")
    case 2: print("February")
    case 3: print("March")
    case 4: print("April")
    case 5: print("May")
    case 6: print("June")
    case 7: print("July")
    case 8: print("August")
    case 9: print("September")
    case 10: print("October")
    case 11: print("November")
    case 12: print("December")
    case _: print("Invalid Month")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int monthNum = 5;

    switch (monthNum) {
        case 1: cout << "January" << endl; break;
        case 2: cout << "February" << endl; break;
        case 3: cout << "March" << endl; break;
        case 4: cout << "April" << endl; break;
        case 5: cout << "May" << endl; break;
        case 6: cout << "June" << endl; break;
        case 7: cout << "July" << endl; break;
        case 8: cout << "August" << endl; break;
        case 9: cout << "September" << endl; break;
        case 10: cout << "October" << endl; break;
        case 11: cout << "November" << endl; break;
        case 12: cout << "December" << endl; break;
        default: cout << "Invalid Month" << endl;
    }
    return 0;
}''')
)

i6 = question(6, "Traffic Light (Switch / Match-Case)",
    "اطلب لون الإشارة (red/yellow/green) واطبع: red -> Stop، yellow -> Ready، green -> Go.",
    "في C++ الـ Switch مش بيشتغل على String مباشرة، فبنستخدم if/else بدلاً منه هنا، لكن في JS وPython بنستخدم Switch/match عادي.",
    code_panel(
js='''let color = "red";

switch (color) {
    case "red": console.log("Stop"); break;
    case "yellow": console.log("Ready"); break;
    case "green": console.log("Go"); break;
    default: console.log("Invalid Color");
}''',
py='''color = "red"

match color:
    case "red": print("Stop")
    case "yellow": print("Ready")
    case "green": print("Go")
    case _: print("Invalid Color")''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    string color = "red";

    if (color == "red") cout << "Stop" << endl;
    else if (color == "yellow") cout << "Ready" << endl;
    else if (color == "green") cout << "Go" << endl;
    else cout << "Invalid Color" << endl;
    return 0;
}''')
)

add("sessionI", "🔀", "Nested If & Switch / Match-Case",
    "جزء أول بيتمرن على الشروط المتداخلة (Nested If)، وجزء تاني بيتمرن على Switch في JS/C++ وmatch-case في Python كبديل لسلسلة else if الطويلة.",
    i1+i2+i3+i4+i5+i6)

# ============================= SECTION J: Session 03 (split) =============================
j1 = question(1, "Student Grade (JavaScript)",
    "اطلب الدرجة واطبع التقدير: 90+ Excellent، 80+ Very Good، 70+ Good، 60+ Pass، أقل من 60 Fail.",
    "سلسلة else if بترتيب تنازلي من أعلى تقدير لأقله.",
    code_panel(
js='''let score = 88;

if (score >= 90) console.log("Excellent");
else if (score >= 80) console.log("Very Good");
else if (score >= 70) console.log("Good");
else if (score >= 60) console.log("Pass");
else console.log("Fail");''')
)

j2 = question(2, "Login System (JavaScript, Nested if)",
    "أنشئ برنامج Login ببيانات صحيحة username=admin, password=1234. استخدم Nested if وطبع Login Success أو Wrong Password أو Username Not Found.",
    "الشرط الخارجي: هل اسم المستخدم صح؟ لو أيوه، ندخل نتأكد من كلمة السر. لو اسم المستخدم غلط أصلاً، منعديش لفحص الباسورد.",
    code_panel(
js='''let correctUser = "admin", correctPass = "1234";
let user = "admin", pass = "0000";

if (user === correctUser) {
    if (pass === correctPass) console.log("Login Success");
    else console.log("Wrong Password");
} else {
    console.log("Username Not Found");
}''')
)

j3 = question(3, "Restaurant Menu (JavaScript, Switch)",
    "اعرض القائمة (1-Pizza, 2-Burger, 3-Pasta, 4-Chicken)، اطلب رقم من المستخدم، استخدم Switch واطبع اسم الوجبة، وInvalid Choice لو الاختيار غلط.",
    "كل رقم في القائمة بيتقابل مع case في الـ Switch.",
    code_panel(
js='''let choice = 2;

switch (choice) {
    case 1: console.log("Pizza"); break;
    case 2: console.log("Burger"); break;
    case 3: console.log("Pasta"); break;
    case 4: console.log("Chicken"); break;
    default: console.log("Invalid Choice");
}''')
)

j4 = question(4, "Discount System (JavaScript)",
    "اطلب Total Price وHas Coupon وVIP. لو (Total >= 500 AND Coupon) OR VIP اطبع Discount Applied، غير كده No Discount.",
    "شرط مركّب: جزء بـ AND جوه القوسين، والنتيجة كلها بـ OR مع شرط الـ VIP.",
    code_panel(
js='''let total = 600, coupon = true, vip = false;

if ((total >= 500 && coupon) || vip) {
    console.log("Discount Applied");
} else {
    console.log("No Discount");
}''')
)

j5 = question(5, "Smart Employee System (JavaScript, Nested if)",
    "اطلب Username وPassword وAge وYears Of Experience. بعد نجاح تسجيل الدخول (admin/1234) بس: لو Age >= 21 وExperience >= 2 اطبع Welcome Senior Employee، غير كده Junior Employee. لو تسجيل الدخول خطأ اطبع الرسالة المناسبة.",
    "الشرط الخارجي هو تسجيل الدخول، وجواه بس بنتحقق من السن والخبرة. استخدمنا String Concatenation عشان نضيف اسم المستخدم في الرسالة.",
    code_panel(
js='''let inUser = "admin", inPass = "1234", empAge = 25, exp = 3;

if (inUser === "admin" && inPass === "1234") {
    if (empAge >= 21 && exp >= 2) {
        console.log("Welcome Senior Employee, " + inUser + "!");
    } else {
        console.log("Junior Employee, " + inUser);
    }
} else {
    console.log("Invalid Login Credentials");
}''')
)

jp1 = question(1, "Weekend Checker (Python)",
    "اطلب اسم اليوم. لو Friday أو Saturday اطبع Weekend، غير كده Working Day.",
    "شرط بسيط بـ or بين قيمتين نصيتين.",
    code_panel(
py='''day_name = "Saturday"

if day_name == "Friday" or day_name == "Saturday":
    print("Weekend")
else:
    print("Working Day")''')
)

jp2 = question(2, "University Admission (Python)",
    "اطلب Age وDegree وHas English Certificate. الطالب يتقبل لو Age >= 18 وDegree >= 75 وHas English Certificate = True.",
    "ثلاث شروط مع بعض بـ and.",
    code_panel(
py='''age, degree, has_cert = 19, 80, True

if age >= 18 and degree >= 75 and has_cert:
    print("Accepted")
else:
    print("Rejected")''')
)

jp3 = question(3, "Cinema Ticket (Python)",
    "اطلب العمر. لو أقل من 12 اطبع Child Ticket، لو من 12 لـ17 اطبع Teen Ticket، غير كده Adult Ticket.",
    "سلسلة if/elif/else بترتيب تصاعدي.",
    code_panel(
py='''visitor_age = 15

if visitor_age < 12:
    print("Child Ticket")
elif visitor_age <= 17:
    print("Teen Ticket")
else:
    print("Adult Ticket")''')
)

jp4 = question(4, "Calculator Menu (Python, match)",
    "اعرض قائمة عمليات (1-Add, 2-Subtract, 3-Multiply, 4-Divide)، اطلب رقمين ورقم العملية، استخدم match واطبع النتيجة.",
    "كل رقم عملية بيتقابل مع case في الـ match.",
    code_panel(
py='''n1, n2, op = 10, 5, 1

match op:
    case 1: print(n1 + n2)
    case 2: print(n1 - n2)
    case 3: print(n1 * n2)
    case 4: print(n1 / n2)
    case _: print("Invalid Operation")''')
)

jp5 = question(5, "ATM Mini (Python, match)",
    "الرصيد الابتدائي 5000. اعرض قائمة (1-Withdraw, 2-Deposit, 3-Balance). في السحب تأكد إن المبلغ أكبر من صفر والرصيد يكفي (Nested if)، في الإيداع زوّد الرصيد، وفي عرض الرصيد اطبعه. استخدم match للقائمة.",
    "الـ match بيحدد أي عملية، وجوه حالة السحب فيه شرط Nested If للتأكد من صحة المبلغ.",
    code_panel(
py='''atm_balance, atm_choice, w_amount = 5000, 1, 1000

match atm_choice:
    case 1:
        if w_amount > 0 and w_amount <= atm_balance:
            atm_balance -= w_amount
            print("Withdraw Successful, Balance:", atm_balance)
        else:
            print("Invalid Withdraw")
    case 2:
        atm_balance += 500
        print("Deposit Done, Balance:", atm_balance)
    case 3:
        print("Balance:", atm_balance)
    case _:
        print("Invalid Choice")''')
)

j_bonus = question("⭐", "Bonus – Bank ATM System الكامل",
    "اعمل نظام بنك كامل بقائمة: Withdraw / Deposit / Transfer / Balance / Exit، بحيث القائمة تتكرر لحد ما المستخدم يختار Exit. في التحويل لازم المبلغ أكبر من صفر، الرصيد يكفي، ورقم الحساب يتكون من 10 أرقام بالظبط.",
    "دي نظام بنكي كامل بقايمة بتتكرر (Loop) لحد ما المستخدم يختار Exit. في التحويل لازم نتأكد إن المبلغ أكبر من صفر، الرصيد يكفي، ورقم الحساب فعلاً 10 أرقام.",
    code_panel(
js='''let balance = 5000;
let running = true;

while (running) {
    let choice = parseInt(prompt("1-Withdraw 2-Deposit 3-Transfer 4-Balance 5-Exit"));
    switch (choice) {
        case 1: {
            let amt = parseFloat(prompt("Amount: "));
            if (amt > 0 && amt <= balance) { balance -= amt; console.log("Withdraw Done. Balance: " + balance); }
            else { console.log("Invalid Amount"); }
            break;
        }
        case 2: {
            let dep = parseFloat(prompt("Amount: "));
            balance += dep;
            console.log("Deposit Done. Balance: " + balance);
            break;
        }
        case 3: {
            let acc = prompt("Account Number (10 digits): ");
            let amt = parseFloat(prompt("Amount: "));
            if (acc.length === 10 && amt > 0 && amt <= balance) {
                balance -= amt;
                console.log("Transfer Done to " + acc + ". Balance: " + balance);
            } else {
                console.log("Invalid Transfer");
            }
            break;
        }
        case 4:
            console.log("Balance: " + balance);
            break;
        case 5:
            running = false;
            console.log("Goodbye!");
            break;
        default:
            console.log("Invalid Choice");
    }
}''',
py='''balance = 5000
running = True

while running:
    choice = int(input("1-Withdraw 2-Deposit 3-Transfer 4-Balance 5-Exit: "))
    match choice:
        case 1:
            amt = float(input("Amount: "))
            if amt > 0 and amt <= balance:
                balance -= amt
                print("Withdraw Done. Balance:", balance)
            else:
                print("Invalid Amount")
        case 2:
            dep = float(input("Amount: "))
            balance += dep
            print("Deposit Done. Balance:", balance)
        case 3:
            acc = input("Account Number (10 digits): ")
            amt = float(input("Amount: "))
            if len(acc) == 10 and amt > 0 and amt <= balance:
                balance -= amt
                print("Transfer Done to", acc, ". Balance:", balance)
            else:
                print("Invalid Transfer")
        case 4:
            print("Balance:", balance)
        case 5:
            running = False
            print("Goodbye!")
        case _:
            print("Invalid Choice")''',
cpp='''#include <iostream>
#include <string>
using namespace std;

int main() {
    double balance = 5000;
    bool running = true;

    while (running) {
        int choice;
        cout << "1-Withdraw 2-Deposit 3-Transfer 4-Balance 5-Exit: ";
        cin >> choice;
        switch (choice) {
            case 1: {
                double amt; cout << "Amount: "; cin >> amt;
                if (amt > 0 && amt <= balance) { balance -= amt; cout << "Withdraw Done. Balance: " << balance << endl; }
                else cout << "Invalid Amount" << endl;
                break;
            }
            case 2: {
                double dep; cout << "Amount: "; cin >> dep;
                balance += dep;
                cout << "Deposit Done. Balance: " << balance << endl;
                break;
            }
            case 3: {
                string acc; double amt;
                cout << "Account Number (10 digits): "; cin >> acc;
                cout << "Amount: "; cin >> amt;
                if (acc.length() == 10 && amt > 0 && amt <= balance) {
                    balance -= amt;
                    cout << "Transfer Done to " << acc << ". Balance: " << balance << endl;
                } else {
                    cout << "Invalid Transfer" << endl;
                }
                break;
            }
            case 4:
                cout << "Balance: " << balance << endl;
                break;
            case 5:
                running = false;
                cout << "Goodbye!" << endl;
                break;
            default:
                cout << "Invalid Choice" << endl;
        }
    }
    return 0;
}''')
)

add("sessionJ", "🏦", "Session 03 – Decision Making + Bank ATM Bonus",
    "الأسئلة الأصلية مقسّمة JS و Python زي ما اتطلب بالظبط، كل سؤال بكوده الخاص، وفي الآخر نظام بنكي كامل بالتلات لغات بلوب (Loop) وقايمة اختيارات.",
    "<h3>الأسئلة بـ JavaScript</h3>"+j1+j2+j3+j4+j5+"<h3>الأسئلة بـ Python</h3>"+jp1+jp2+jp3+jp4+jp5+j_bonus)

# ============================= SECTION K: For Loop (split) =============================
k1 = question(1, "Print Numbers",
    "اطبع الأرقام من 1 إلى 10، كل رقم في سطر لوحده.",
    "for loop بسيطة تبدأ من 1 وتوقف عند 10.",
    code_panel(
js='''for (let i = 1; i <= 10; i++) {
    console.log(i);
}''',
py='''for i in range(1, 11):
    print(i)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) cout << i << endl;
    return 0;
}''')
)

k2 = question(2, "Even Numbers",
    "اطبع كل الأرقام الزوجية من 1 إلى 20.",
    "بنلف من 1 لـ20، وجوه اللوب بنستخدم if مع % 2 عشان نعرف الرقم زوجي.",
    code_panel(
js='''for (let i = 1; i <= 20; i++) {
    if (i % 2 === 0) console.log(i);
}''',
py='''for i in range(1, 21):
    if i % 2 == 0:
        print(i)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 20; i++) if (i % 2 == 0) cout << i << endl;
    return 0;
}''')
)

k3 = question(3, "Sum of Numbers",
    "احسب مجموع الأرقام من 1 إلى 100، واطبع الناتج فقط.",
    "نعمل متغير sum يبدأ من 0، وفي كل تكرار من اللوب نزوّد عليه قيمة i. بعد ما اللوب يخلص نطبع sum.",
    code_panel(
js='''let sum = 0;
for (let i = 1; i <= 100; i++) {
    sum += i;
}
console.log(sum);''',
py='''total = 0
for i in range(1, 101):
    total += i
print(total)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 100; i++) sum += i;
    cout << sum << endl;
    return 0;
}''')
)

k4 = question(4, "Multiplication Table",
    "اطلب من المستخدم رقم، واطبع جدول ضربه من 1 إلى 10.",
    "لوب من 1 لـ10، وفي كل مرة نضرب الرقم في قيمة i ونطبع السطر.",
    code_panel(
js='''let n = Number(prompt("Enter a number: "));
for (let i = 1; i <= 10; i++) {
    console.log(n + " x " + i + " = " + (n * i));
}''',
py='''n = int(input("Enter a number: "))
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a number: "; cin >> n;
    for (int i = 1; i <= 10; i++) cout << n << " x " << i << " = " << n * i << endl;
    return 0;
}''')
)

k5 = question(5, "Countdown",
    "اطلب من المستخدم رقم، واطبع الأرقام من الرقم اللي دخله لحد 1.",
    "بداية اللوب من الرقم اللي المستخدم كتبه، وبنستخدم i-- بدل i++ عشان نعد لأسفل.",
    code_panel(
js='''let start = Number(prompt("Enter a number: "));
for (let i = start; i >= 1; i--) {
    console.log(i);
}''',
py='''start = int(input("Enter a number: "))
for i in range(start, 0, -1):
    print(i)''',
cpp='''#include <iostream>
using namespace std;

int main() {
    int start;
    cout << "Enter a number: "; cin >> start;
    for (int i = start; i >= 1; i--) cout << i << endl;
    return 0;
}''')
)

add("sessionK", "🔁", "For Loop",
    "خمس تدريبات بسيطة على for loop، كل واحد بكوده المستقل: طباعة، شرط جوه اللوب، تجميع (Accumulator)، لوب مع إدخال، وعد تنازلي.",
    k1+k2+k3+k4+k5)

with open('/home/claude/toc.html','w') as f: f.write(toc_items)
with open('/home/claude/sections.html','w') as f: f.write(sections_html)
print("done", len(sections_html))