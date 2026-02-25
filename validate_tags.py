import re
import os

file_path = r'd:\SMS-UI\sms-ui\src\app\layouts\main-layout\main-layout.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Focusing on the sidebar part
start_tag = '<div class="kt-aside-menu-wrapper'
end_marker = '<!-- end:: Aside Menu -->'
start_index = content.find(start_tag)
end_index = content.find(end_marker)

if start_index != -1 and end_index != -1:
    sidebar_content = content[start_index:end_index]
    # Simple regex for tags, ignoring attributes for now
    tags = re.findall(r'<(/?)(li|ul|div|a|span|i|h4|svg|g|rect|path|polygon)\b', sidebar_content)
    
    stack = []
    for closing, tag in tags:
        if closing:
            if not stack:
                print(f"Mismatched closing tag: </{tag}> but stack empty")
            else:
                top = stack.pop()
                if top != tag:
                    print(f"Mismatched closing tag: </{tag}> but expected </{top}>")
        else:
            # Self-closing tags in HTML might not have '/', but some tags like path, rect are often self-closing in SVG
            # However, re.findall captures the opening/closing.
            # We should skip self-closing common ones if they end with />
            # But rect/path in templates might be <path ... />
            stack.append(tag)
    
    if stack:
        print(f"Unclosed tags: {stack}")
    else:
        print("Tags balanced in sidebar.")
else:
    print("Could not find sidebar boundaries.")
