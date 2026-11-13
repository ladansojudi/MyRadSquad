"""Builds the submission folder, ../Submission next to this project:

    MyRadSquad - Case A.html   one self-contained page (works on a phone): brief, research,
                               problem, solution, design file, experiment note
    Design file/               the screenshots, numbered and named in flow order
    Experiment note.pdf        the half-page note
    Test plan.pdf              how the A/B test would run
    Prototype walkthrough.mp4  the whole flow on the iPhone Simulator, in two minutes

and ../README.pdf (from docs/FOLDER_README.md): what Submission/ and myradsquad/ are, what's
inside them, what to open first, and how to try the prototype.

Reads docs/AI_TOOLS.md, docs/EXPERIMENT_NOTE.md, docs/FOLDER_README.md and
docs/screenshots/*.png. Also refreshes ~/Desktop/MyRadSquad RQ Dashboard.html.

    python3 scripts/build-submission.py
"""

import base64
import html
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = os.path.join(ROOT, 'scripts', 'submission.template.html')
import shutil

SUBMISSION = os.path.join(os.path.dirname(ROOT), 'Submission')
PAGE = os.path.join(SUBMISSION, 'MyRadSquad - Case A.html')
DESKTOP_PAGE = os.path.expanduser('~/Desktop/MyRadSquad RQ Dashboard.html')

# Screenshot file -> its name in the design file.
FILE_NAMES = {
    '00-cover': '00 Cover - AI tools and Spark trust',
    '01-splash': '01 Splash',
    '02-age-gate': '02 Age gate (13+)',
    '03-why-we-ask': '03 Why we ask',
    '04-intro-squad': '04 Feature screen 1 - Your squad',
    '05-intro-rooms': '05 Feature screen 2 - Rooms',
    '06-intro-spark': '06 Feature screen 3 - Spark',
    '07-why-here': '07 What are you here for',
    '08-paywall-a': '08 Paywall A',
    '09-ask-a-parent': '09 Ask a parent',
    '10-home': '10 Home',
    '10b-home-annotated': '10b Home - every element and why',
    '11-spark-notification': '11 Home - Spark notification',
    '12-ai-state1-turn-on': '12 AI state 1 - A member turns Spark on',
    '13-ai-state2-squad-sees': '13 AI state 2 - What the squad sees',
    '14-ai-state2-quiet-squad': '14 AI state 2 - A quiet squad gets a spark',
    '15-ai-controls': '15 Spark controls - Mute and remove',
    '16-paywall-b': '16 Paywall B (variant)',
}

# Screen number, file, title, why it is there (cause and effect).
SCREENS = [
    ('01', '01-splash', 'Splash', 'The logo assembles from its pieces: the art kit the whole app is drawn from.'),
    ('02', '02-age-gate', '13+ age gate', 'The iOS date wheel everyone knows; starts on today (a neutral age screen), checks nothing until you spin it.'),
    ('03', '03-why-we-ask', 'Why we ask', 'Three lines: 13 and up, a parent approves purchases under 18, your squad never sees it.'),
    ('04', '04-intro-squad', 'Feature 1 · your squad', 'Invite-first (A1): your friends are already talking, before any ask.'),
    ('05', '05-intro-rooms', 'Feature 2 · rooms', 'Hang out, focus, play: shows what Squad+ adds (focus, study and game rooms).'),
    ('06', '06-intro-spark', 'Feature 3 · Spark', 'Never a dead chat: the AI shown as a vote, before we ask for money.'),
    ('07', '07-why-here', 'What are you here for?', 'One tap; it picks the paywall\'s headline and art.'),
    ('08', '08-paywall-a', 'Paywall A', 'Leads with what they came for; yearly pre-selected, shown per month; "No thanks" always there.'),
    ('09', '09-ask-a-parent', 'Ask a parent', 'Under 18, after "Try 3 days free": Ask to Buy. The table stays free while a parent decides.'),
    ('10', '10-home', 'Home', 'Two minutes after onboarding: Maya\'s table first (who\'s here, one room to join), quiet squads below. No streaks.'),
    ('11', '11-spark-notification', 'Spark\'s one notification', 'At most once a day, only for a quiet squad, in the squad\'s name.'),
    ('12', '12-ai-state1-turn-on', 'AI state 1 · turn it on', 'The member who adds Spark picks a vibe and sees its four rules first.'),
    ('13', '13-ai-state2-squad-sees', 'AI state 2 · the squad sees', '"Maya added Spark" with Mute, then Spark\'s prompt, labelled AI.'),
    ('14', '14-ai-state2-quiet-squad', 'A quiet squad\'s spark', 'A vote inside the chat; your answer pings the squad (you, not Spark).'),
    ('15', '15-ai-controls', 'Spark controls', 'Rules, Mute for me, Remove for everyone: anyone in the squad can.'),
    ('16', '16-paywall-b', 'Paywall B (variant)', 'Seat-led: 5 of 5 taken, room for 12, two friends who want in. Static, as the brief allows.'),
]


CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

PDF_CSS = """
@page{size:A4;margin:16mm 16mm 18mm}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#1c1917;font:10.5pt/1.5 Rubik,-apple-system,sans-serif}
h1{font-size:24pt;font-weight:600;letter-spacing:-.02em;margin:0 0 4pt}
h2{font-size:13pt;font-weight:600;color:#6a5fd6;margin:18pt 0 6pt;padding-top:10pt;border-top:2pt solid #eef0fb}
h3{font-size:11pt;font-weight:600;margin:12pt 0 4pt}
p{margin:0 0 7pt}
ul,ol{margin:0 0 8pt;padding-left:16pt}li{margin:2pt 0}
b,strong{font-weight:600}
a{color:#6a5fd6}
code{font:9pt/1.4 ui-monospace,Menlo,monospace;background:#eef0fb;border-radius:4pt;padding:1pt 4pt}
pre{background:#eef0fb;border-radius:10pt;padding:9pt 11pt;margin:0 0 9pt;white-space:pre-wrap;word-break:break-all}
pre code{background:none;padding:0}
table{width:100%;border-collapse:separate;border-spacing:0;margin:0 0 10pt;border-radius:10pt;overflow:hidden;background:#fff;box-shadow:0 0 0 1pt #e2e3ef}
th{background:#e3f3ee;text-align:left;font-weight:600;font-size:9.5pt}
th,td{padding:6pt 9pt;vertical-align:top;border-bottom:1pt solid #eef0fb}
tr:last-child td{border-bottom:0}
td:first-child{white-space:nowrap;font-weight:500}
em{font-style:normal;background:#f6e7b8;border-radius:4pt;padding:0 3pt}
.mark{display:flex;gap:3pt;margin-bottom:10pt}.mark i{display:block;width:10pt;height:10pt}
.q1{background:#f4a594;border-radius:10pt 0 0 0}.q2{background:#aab5ec;border-radius:0 10pt 0 0}.q3{background:#9fd4c5;border-radius:50%}
h2,h3,table,pre{break-inside:avoid}h2,h3{break-after:avoid}
"""


def md_inline(t):
    t = html.escape(t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<![\w*])_(.+?)_(?![\w*])', r'<em>\1</em>', t)
    t = re.sub(r'(?<![\w*])\*(.+?)\*(?![\w*])', r'<i>\1</i>', t)
    return t


def md_to_html(md):
    """Enough Markdown for our READMEs: headings, paragraphs, lists, tables, code."""
    lines, out, i = md.split('\n'), [], 0
    while i < len(lines):
        l = lines[i]
        if l.startswith('```'):
            j = i + 1
            while j < len(lines) and not lines[j].startswith('```'):
                j += 1
            out.append('<pre><code>' + html.escape('\n'.join(lines[i + 1:j])) + '</code></pre>')
            i = j + 1
            continue
        m = re.match(r'^(#{1,3}) (.*)', l)
        if m:
            n = len(m.group(1))
            out.append(f'<h{n}>{md_inline(m.group(2))}</h{n}>')
            i += 1
            continue
        if l.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', c) for c in cells):
                    rows.append(cells)
                i += 1
            head, body = rows[0], rows[1:]
            head_html = '' if not any(head) else '<tr>' + ''.join(f'<th>{md_inline(c)}</th>' for c in head) + '</tr>'
            out.append('<table>' + head_html
                       + ''.join('<tr>' + ''.join(f'<td>{md_inline(c)}</td>' for c in r) + '</tr>' for r in body)
                       + '</table>')
            continue
        if re.match(r'^\s*(\d+\.|-) ', l):
            ordered = bool(re.match(r'^\s*\d+\.', l))
            items = []
            while i < len(lines) and (re.match(r'^\s*(\d+\.|-) ', lines[i]) or (lines[i].startswith('  ') and items)):
                cur = lines[i]
                m2 = re.match(r'^(\s*)(\d+\.|-) (.*)', cur)
                if m2:
                    items.append([len(m2.group(1)), m2.group(3)])
                else:
                    items[-1][1] += ' ' + cur.strip()
                i += 1
            tag = 'ol' if ordered else 'ul'
            first = re.match(r'^\s*(\d+)\.', l)
            start = f' start="{first.group(1)}"' if ordered and first and first.group(1) != '1' else ''
            html_items, depth = [f'<{tag}{start}>'], 0
            for indent, text in items:
                if indent > 0 and depth == 0:
                    html_items[-1] = html_items[-1].replace('</li>', '') ; html_items.append('<ul>'); depth = 1
                elif indent == 0 and depth == 1:
                    html_items.append('</ul></li>'); depth = 0
                html_items.append(f'<li>{md_inline(text)}</li>')
            if depth:
                html_items.append('</ul></li>')
            html_items.append(f'</{tag}>')
            out.append(''.join(html_items))
            continue
        if not l.strip():
            i += 1
            continue
        para = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|\||```|\s*(\d+\.|-) )', lines[i]):
            para.append(lines[i].strip())
            i += 1
        out.append('<p>' + md_inline(' '.join(para)) + '</p>')
    return '\n'.join(out)


def write_pdf(md_path, pdf_path, title):
    """A Markdown file as an A4 PDF in the app's look (Rubik, pastels), via headless Chrome."""
    with open(md_path) as f:
        body = md_to_html(f.read())
    page = (f'<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(title)}</title>'
            '<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">'
            f'<style>{PDF_CSS}</style></head><body>'
            '<div class="mark"><i class="q1"></i><i class="q2"></i><i class="q3"></i></div>'
            f'{body}</body></html>')
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, 'page.html')
        with open(src, 'w') as f:
            f.write(page)
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                        '--virtual-time-budget=4000', f'--print-to-pdf={pdf_path}',
                        'file://' + src], check=True, capture_output=True)


def image_data(name):
    """A screenshot as a compact JPEG data URI."""
    src = os.path.join(ROOT, 'docs', 'screenshots', name + '.png')
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, name + '.jpg')
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1000',
                        src, '--out', out], check=True, capture_output=True)
        with open(out, 'rb') as f:
            return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()


def inline_md(text):
    """Bold and italics from the markdown notes, everything else escaped."""
    t = html.escape(text)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'_(\[.+?\])_', r'\1', t)
    return t


def tools_html():
    with open(os.path.join(ROOT, 'docs', 'AI_TOOLS.md')) as f:
        lines = f.read().split('\n')
    items, cur = [], None
    for line in lines:
        s = line.strip()
        m = re.match(r'^\d+\.\s+(.*)', s)
        if m:
            cur = [m.group(1)]
            items.append(cur)
        elif s and cur is not None and not s.startswith(('#', '>')):
            cur.append(s)
    return '<ol>' + ''.join(f'<li>{inline_md(" ".join(i))}</li>' for i in items) + '</ol>'


def note_html():
    with open(os.path.join(ROOT, 'docs', 'EXPERIMENT_NOTE.md')) as f:
        text = f.read()
    paras = [p.strip() for p in text.split('\n\n') if p.strip() and not p.startswith('#')]
    out = []
    for p in paras:
        p = ' '.join(l.strip() for l in p.split('\n'))
        cls = ' class="todo"' if '[' in p and ']' in p and 'What changed' in p else ''
        out.append(f'<p{cls}>{inline_md(p)}</p>')
    return '\n'.join(out)


def screens_html():
    out = []
    for n, name, title, why in SCREENS:
        out.append(
            f'<figure><img src="{{{{IMG:{name}}}}}" alt="{html.escape(title)}" loading="lazy">'
            f'<figcaption><span class="n">{n}</span><b>{html.escape(title)}</b>'
            f'<span>{html.escape(why)}</span></figcaption></figure>')
    return '\n      '.join(out)


def main():
    with open(TEMPLATE) as f:
        page = f.read()
    page = page.replace('{{TOOLS}}', tools_html())
    page = page.replace('{{NOTE}}', note_html())
    with open(os.path.join(ROOT, 'docs', 'TEST_PLAN.md')) as f:
        plan = re.sub(r'^# .*\n', '', f.read(), count=1)
    page = page.replace('{{PLAN}}', md_to_html(plan))
    page = page.replace('{{SCREENS}}', screens_html())
    for name in sorted(set(re.findall(r'\{\{IMG:([\w-]+)\}\}', page))):
        page = page.replace('{{IMG:%s}}' % name, image_data(name))

    # A clean folder every time, so nothing stale is sent.
    if os.path.isdir(SUBMISSION):
        shutil.rmtree(SUBMISSION)
    design = os.path.join(SUBMISSION, 'Design file')
    os.makedirs(design)
    for src, name in FILE_NAMES.items():
        shutil.copy(os.path.join(ROOT, 'docs', 'screenshots', src + '.png'),
                    os.path.join(design, name + '.png'))
    shutil.copy(os.path.join(ROOT, 'docs', 'walkthrough.mp4'),
                os.path.join(SUBMISSION, 'Prototype walkthrough.mp4'))
    write_pdf(os.path.join(ROOT, 'docs', 'EXPERIMENT_NOTE.md'),
              os.path.join(SUBMISSION, 'Experiment note.pdf'), 'Experiment note · Paywall A vs B')
    write_pdf(os.path.join(ROOT, 'docs', 'TEST_PLAN.md'),
              os.path.join(SUBMISSION, 'Test plan.pdf'), 'Test plan · Paywall A vs B')
    # The folder guide lives one level up, next to Submission/ and myradsquad/, as a PDF so
    # anyone can open it (a .md opens as plain text on most machines).
    top = os.path.dirname(ROOT)
    old_md = os.path.join(top, 'README.md')
    if os.path.exists(old_md):
        os.remove(old_md)
    write_pdf(os.path.join(ROOT, 'docs', 'FOLDER_README.md'), os.path.join(top, 'README.pdf'),
              'MyRadSquad · Case A · Read me')
    for out in (PAGE, DESKTOP_PAGE):
        with open(out, 'w') as f:
            f.write(page)
    print(f'wrote {SUBMISSION} ({len(page) // 1024} KB page, {len(FILE_NAMES)} images)')


if __name__ == '__main__':
    main()
