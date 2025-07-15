from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import sys

from config import settings

# Setting up the options
options = Options()
if settings.HEADLESS:
    options.add_argument("--headless=new")
options.add_argument('--ignore-ssl-errors=yes')
options.add_argument('--ignore-certificate-errors=yes')
options.add_argument("--log-level=3")
# 自动适配 Chrome 路径
if sys.platform == "darwin":
    # MacOS
    options.binary_location = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif sys.platform.startswith("linux"):
    # Linux (Docker/云服务器)
    options.binary_location = "/usr/bin/google-chrome"

# Setting up service with proper Chrome path for macOS
# Don't create service at module level to avoid file handle conflicts
def get_chrome_service():
    """Get a fresh Chrome service instance to avoid file handle conflicts"""
    return Service(ChromeDriverManager().install())

def find_by_xpath_or_None(driver, *xpaths):
    """returns the text inside and elemnt by its xPath"""
    for xpath in xpaths:
        try:
            return driver.find_element(By.XPATH, xpath).text
        except NoSuchElementException:
            #print(f"Element not found : {xpath}")
            continue
    return None


def search_for_candidate_name(driver):
    """search for profile's name in the page using semantic XPath"""
    try:
        # 使用更健壮的XPath选择器，不依赖特定的ember ID
        # 基于class名和结构模式，这些在不同用户之间更一致
        name = find_by_xpath_or_None(driver,
            # 方法1: 查找包含名字的h1元素，通常在profile的顶部
            "//h1[contains(@class, 't-24') and contains(@class, 'break-words')]",
            # 方法2: 查找aria-label包含名字的链接
            "//a[contains(@aria-label, ' ') and contains(@class, 'ember-view')]/h1",
            # 方法3: 查找特定的class组合
            "//h1[contains(@class, 'inline') and contains(@class, 't-24') and contains(@class, 'break-words')]",
            # 方法4: 备用方案 - 查找任何包含名字的h1
            "//h1[contains(@class, 't-24')]",
            # 方法5: 基于文本内容查找（如果其他方法都失败）
            "//h1[contains(@class, 'break-words')]"
        )
        
        if name:
            print(f"Found name using XPath: {name}")
            return name
            
        # 如果XPath方法失败，尝试使用JavaScript获取
        try:
            name_js = driver.execute_script("""
                // 尝试多种选择器
                const selectors = [
                    'h1.t-24.break-words',
                    'h1[class*="t-24"][class*="break-words"]',
                    'a[aria-label*=" "] h1',
                    'h1.inline.t-24.v-align-middle.break-words'
                ];
                
                for (let selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        return element.textContent.trim();
                    }
                }
                return null;
            """)
            
            if name_js:
                print(f"Found name using JavaScript: {name_js}")
                return name_js
                
        except Exception as js_error:
            print(f"JavaScript fallback failed: {js_error}")
            
    except Exception as e:
        print(f"Error finding name: {e}")
    return None

#search for profile avatar in the page using semantic XPath
def search_for_candidate_avatar(driver):
    """search for profile avatar in the page using semantic XPath"""
    try:
        # 使用更健壮的选择器，不依赖特定的ember ID
        avatar_selectors = [
            # 方法1: 查找profile头像的img元素
            "//img[contains(@class, 'pv-top-card-profile-picture__image')]",
            # 方法2: 查找包含profile-picture的class
            "//img[contains(@class, 'profile-picture')]",
            # 方法3: 查找EntityPhoto相关的class
            "//img[contains(@class, 'EntityPhoto')]",
            # 方法4: 查找evi-image class（LinkedIn常用的图片class）
            "//img[contains(@class, 'evi-image')]",
            # 方法5: 查找alt属性包含profile的图片
            "//img[contains(@alt, 'profile')]",
            # 方法6: 备用方案 - 查找任何可能的头像图片
            "//img[contains(@class, 'ember-view')]"
        ]
        
        for selector in avatar_selectors:
            try:
                avatar_element = driver.find_element(By.XPATH, selector)
                avatar_url = avatar_element.get_attribute('src')
                if avatar_url and 'profile' in avatar_url.lower():
                    print(f"Found avatar using selector: {selector}")
                    return avatar_url
            except Exception:
                continue
                
        # 如果XPath方法失败，尝试使用JavaScript
        try:
            avatar_js = driver.execute_script("""
                const selectors = [
                    'img.pv-top-card-profile-picture__image',
                    'img[class*="profile-picture"]',
                    'img[class*="EntityPhoto"]',
                    'img[class*="evi-image"]',
                    'img[alt*="profile"]'
                ];
                
                for (let selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.src && element.src.includes('profile')) {
                        return element.src;
                    }
                }
                return null;
            """)
            
            if avatar_js:
                print(f"Found avatar using JavaScript: {avatar_js}")
                return avatar_js
                
        except Exception as js_error:
            print(f"JavaScript fallback for avatar failed: {js_error}")
            
    except Exception as e:
        print(f"Error finding avatar: {e}")
    return None

#search for profile's headline in the page using semantic XPath
def search_for_candidate_headline(driver):
    """search for profile's headline in the page using semantic XPath"""
    try:
        # 使用更健壮的选择器，不依赖特定的路径
        headline = find_by_xpath_or_None(driver, 
            # 方法1: 查找包含headline文本的div
            "//div[contains(@class, 'text-body-medium') and contains(@class, 'break-words')]",
            # 方法2: 查找包含特定文本模式的div
            "//div[contains(@class, 'text-body-medium')]",
            # 方法3: 查找包含emoji和文本的div（headline通常包含emoji）
            "//div[contains(text(), '🎓') or contains(text(), '💼') or contains(text(), '🏢')]",
            # 方法4: 查找包含@符号的文本（通常表示公司）
            "//div[contains(text(), '@')]",
            # 方法5: 查找包含特定关键词的文本
            "//div[contains(text(), 'Computer Science') or contains(text(), 'Software') or contains(text(), 'Engineer')]",
            # 方法6: 备用方案 - 查找任何可能的headline
            "//div[contains(@class, 'break-words') and string-length(text()) > 10]"
        )
        
        if headline:
            print(f"Found headline using XPath: {headline}")
            return headline
            
        # 如果XPath方法失败，尝试使用JavaScript
        try:
            headline_js = driver.execute_script("""
                // 尝试多种选择器
                const selectors = [
                    'div.text-body-medium.break-words',
                    'div[class*="text-body-medium"]',
                    'div[class*="break-words"]'
                ];
                
                for (let selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    for (let element of elements) {
                        const text = element.textContent.trim();
                        // 检查是否包含headline的特征（emoji、@符号、关键词等）
                        if (text.length > 10 && (
                            text.includes('🎓') || 
                            text.includes('💼') || 
                            text.includes('🏢') || 
                            text.includes('@') ||
                            text.includes('Computer Science') ||
                            text.includes('Software') ||
                            text.includes('Engineer')
                        )) {
                            return text;
                        }
                    }
                }
                return null;
            """)
            
            if headline_js:
                print(f"Found headline using JavaScript: {headline_js}")
                return headline_js
                
        except Exception as js_error:
            print(f"JavaScript fallback for headline failed: {js_error}")
            
    except Exception as e:
        print(f"Error finding headline: {e}")
    return None



def search_for_section(driver, section_name, min_index=2, max_index=8):
    """search for a section's content by section name using semantic XPath"""
    try:
        # Initialize variables
        found_elements = {
            'positions': [],
            'institutions': [],
            'dates': []
        }

        # Function to add found elements to the dictionary
        def add_elements(position, institution, date):
            if position: found_elements['positions'].append(position)
            if institution: found_elements['institutions'].append(institution)
            if date: found_elements['dates'].append(date)

        # 基于文本内容查找section（避免依赖加密的class名）
        section_selectors = [
            f"//div[@id='{section_name.lower()}']/ancestor::section",
            f"//section[.//h2[contains(text(), '{section_name}')]]",
            f"//section[.//span[contains(text(), '{section_name}')]]"
        ]
        
        target_section = None
        for selector in section_selectors:
            try:
                target_section = driver.find_element(By.XPATH, selector)
                print(f"Found {section_name} section using: {selector}")
                break
            except NoSuchElementException:
                continue
        
        if not target_section:
            print(f"Section '{section_name}' not found")
            return found_elements

        # Experience section
        if section_name == "Experience":
            # 查找所有工作经验项（基于固定的class名）
            experience_items = target_section.find_elements(By.XPATH, 
                ".//li[contains(@class, 'artdeco-list__item')]"
            )
            
            print(f"Found {len(experience_items)} experience items")
            
            for item in experience_items:
                try:
                    # 职位名称 - 基于文本内容和相对位置
                    position = find_by_xpath_or_None(item, 
                        ".//div[contains(@class, 't-bold')]//span",
                        ".//span[contains(@class, 't-bold')]",
                        ".//div[contains(@class, 'mr1')]//span"
                    )
                    
                    # 公司名称 - 基于文本内容和相对位置
                    institution = find_by_xpath_or_None(item, 
                        ".//div[contains(@class, 't-14') and contains(@class, 't-normal')]//span",
                        ".//span[contains(@class, 't-14') and contains(@class, 't-normal')]",
                        ".//a[contains(@class, 'optional-action-target-wrapper')]//span"
                    )
                    
                    # 时间 - 基于class特征
                    date = find_by_xpath_or_None(item, 
                        ".//span[contains(@class, 't-black--light')]",
                        ".//span[contains(@class, 't-14') and contains(@class, 't-normal') and contains(@class, 't-black--light')]",
                        ".//span[contains(@class, 'pvs-entity__caption-wrapper')]"
                    )
                    
                    if position or institution or date:
                        # print(f"  - Position: {position}")
                        # print(f"  - Institution: {institution}")
                        # print(f"  - Date: {date}")
                        add_elements(position, institution, date)
                except Exception as e:
                    print(f"Error parsing experience item: {e}")
                    continue

        # Education section
        elif section_name == "Education":
            # 查找所有教育经历项
            education_items = target_section.find_elements(By.XPATH, 
                ".//li[contains(@class, 'artdeco-list__item')]"
            )
            
            print(f"Found {len(education_items)} education items")
            
            for item in education_items:
                try:
                    # 学校名称 - 在t-bold class中
                    institution = find_by_xpath_or_None(item, 
                        ".//div[contains(@class, 't-bold')]//span",
                        ".//span[contains(@class, 't-bold')]",
                        ".//div[contains(@class, 'mr1')]//span"
                    )
                    
                    # 学位/专业 - 在t-14 t-normal class中
                    position = find_by_xpath_or_None(item, 
                        ".//span[contains(@class, 't-14') and contains(@class, 't-normal')]",
                        ".//div[contains(@class, 't-14') and contains(@class, 't-normal')]//span"
                    )
                    
                    # 时间 - 在t-black--light class中
                    date = find_by_xpath_or_None(item, 
                        ".//span[contains(@class, 't-black--light')]",
                        ".//span[contains(@class, 'pvs-entity__caption-wrapper')]",
                        ".//span[contains(@class, 't-14') and contains(@class, 't-normal') and contains(@class, 't-black--light')]"
                    )
                    
                    if position or institution or date:
                        print(f"  - School: {institution}")
                        print(f"  - Degree: {position}")
                        print(f"  - Date: {date}")
                        add_elements(position, institution, date)
                except Exception as e:
                    print(f"Error parsing education item: {e}")
                    continue

        # About section
        elif section_name == "About":
            # About section主要是文本内容，不需要列表项
            print(f"Found About section")
            
            try:
                
                # 提取About文本内容 - 修复XPath以匹配span元素
                about_text = find_by_xpath_or_None(target_section, 
                    ".//span[@aria-hidden='true' and string-length(text()) > 50]",
                    ".//span[contains(@class, 'visually-hidden') and string-length(text()) > 50]",
                    ".//div[contains(@class, 'display-flex') and contains(@class, 'full-width')]//span[string-length(text()) > 50]",
                    ".//div[contains(@class, 't-14') and contains(@class, 't-normal') and contains(@class, 't-black')]//span[string-length(text()) > 50]",
                    ".//span[contains(@class, 't-14') and contains(@class, 't-normal') and string-length(text()) > 50]",
                    ".//div[contains(@class, 'display-flex') and contains(@class, 'full-width')]//span"
                )
                
                if about_text:
                    print(f"  - About text: {about_text[:100]}...")  # 只显示前100个字符
                    # 将About文本作为position字段存储
                    found_elements['positions'].append(about_text)
                    found_elements['institutions'].append("About")
                    found_elements['dates'].append("")
                else:
                    print("  - No about text found")
                    
            except Exception as e:
                print(f"Error parsing about section: {e}")
        
        return found_elements
    except Exception as e:
        print(f"Error finding section '{section_name}': {e}")
        return None


def search_for_company_name(driver):
    """search for company's name using semantic XPath"""
    try:
        company_name = find_by_xpath_or_None(driver, 
            "//h1[contains(@class, 'company-name')]",
            "//h1[contains(@class, 'org-top-card-summary__title')]",
            "//h1[contains(@class, 'pv-text-details__left-panel')]//h1",
            "//div[contains(@class, 'company-name')]//h1"
        )
        return company_name
    except Exception as e:
        print(f"Error finding company name: {e}")
    return None


def search_for_company_industry(driver):
    """search for company's industry using semantic XPath"""
    try:
        company_industry = find_by_xpath_or_None(driver, 
            "//div[contains(@class, 'company-industry')]",
            "//div[contains(@class, 'org-top-card-summary-info-list__info-item')]",
            "//div[contains(@class, 'pv-text-details__left-panel')]//div[contains(@class, 'text-body-small')]"
        )
        return company_industry
    except Exception as e:
        print(f"Error finding company industry: {e}")
    return None


def search_for_company_about(driver):
    """search for company's about section using semantic XPath"""
    try:
        # 先尝试点击"Show more"按钮
        try:
            more_button = driver.find_element(By.XPATH, 
                "//button[contains(text(), 'Show more')] | //button[contains(text(), 'See more')] | //span[contains(text(), 'Show more')]/parent::button"
            )
            more_button.click()
        except NoSuchElementException:
            pass
        
        company_about = find_by_xpath_or_None(driver, 
            "//div[contains(@class, 'company-about')]",
            "//div[contains(@class, 'org-about-us-organization-description__text')]",
            "//div[contains(@class, 'pv-shared-text-with-see-more')]//span",
            "//section[contains(@class, 'about')]//div[contains(@class, 'text-body-medium')]"
        )
        return company_about
    except Exception as e:
        print(f"Error finding company about: {e}")
    return None
    

def add_session_cookie(driver):
    """load cookies from a file and add it to the driver"""
    cookie = {
        "domain": ".www.linkedin.com",
        "name": "li_at",
        "value": settings.LINKEDIN_ACCESS_TOKEN,
        "path": "/",
        "secure": True,
        "httpOnly": True,
        "expirationDate": settings.LINKEDIN_ACCESS_TOKEN_EXP,
    }
    # Add cookies to the driver
    try:
        driver.get("https://www.linkedin.com")
        driver.add_cookie(cookie)
    except Exception as e:
        print(f"Error adding cookies to driver : {e}")
    