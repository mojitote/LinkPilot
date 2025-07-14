import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.candidate_scraper import scrape_linkedin_profile
import json
import os

def debug_scrape_profile():
    """Debug function to scrape LinkedIn profile with manual ID input"""
    
    # 手动输入LinkedIn ID
    linkedin_id = input("请输入LinkedIn ID (例如: john-doe): ").strip()
    
    if not linkedin_id:
        print("❌ LinkedIn ID不能为空")
        return
    
    print(f"\n🔍 开始抓取LinkedIn档案: {linkedin_id}")
    print("=" * 50)
    
    # 抓取数据
    result = scrape_linkedin_profile(linkedin_id)
    
    print("\n📊 抓取结果:")
    print("=" * 50)
    
    if "error" in result:
        print(f"❌ 错误: {result['error']}")
    else:
        print("✅ 抓取成功!")
        print(f"📝 LinkedIn ID: {result.get('linkedin_id', 'N/A')}")
        print(f"👤 姓名: {result.get('name', 'N/A')}")
        print(f"🖼️ 头像: {result.get('avatar', 'N/A')}")
        print(f"💼 headline: {result.get('headline', 'N/A')}")
        print(f"💼 About: {result.get('about', 'N/A')}")
        # 教育经历
        education = result.get('education', {})
        if education and isinstance(education, dict):
            print(f"\n🎓 教育经历:")
            positions = education.get('positions', [])
            institutions = education.get('institutions', [])
            dates = education.get('dates', [])
            
            for i in range(max(len(positions), len(institutions), len(dates))):
                pos = positions[i] if i < len(positions) else 'N/A'
                inst = institutions[i] if i < len(institutions) else 'N/A'
                date = dates[i] if i < len(dates) else 'N/A'
                print(f"  {i+1}. {pos} at {inst} ({date})")
        else:
            print("🎓 教育经历: 无数据")
        
        # 工作经验
        experience = result.get('experience', {})
        if experience and isinstance(experience, dict):
            print(f"\n💼 工作经验:")
            positions = experience.get('positions', [])
            institutions = experience.get('institutions', [])
            dates = experience.get('dates', [])
            
            for i in range(max(len(positions), len(institutions), len(dates))):
                pos = positions[i] if i < len(positions) else 'N/A'
                inst = institutions[i] if i < len(institutions) else 'N/A'
                date = dates[i] if i < len(dates) else 'N/A'
                print(f"  {i+1}. {pos} at {inst} ({date})")
        else:
            print("💼 工作经验: 无数据")
        
        # 保存JSON结果
        js_dir = os.path.join(os.path.dirname(__file__), "htmls", "js")
        os.makedirs(js_dir, exist_ok=True)
        json_file_path = os.path.join(js_dir, f"{linkedin_id}_result.json")
        with open(json_file_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\n💾 JSON结果已保存到: {json_file_path}")
        
        # 显示HTML文件路径
        html_file_path = os.path.join(os.path.dirname(__file__), "htmls", f"{linkedin_id}.html")
        if os.path.exists(html_file_path):
            print(f"📄 HTML源码已保存到: {html_file_path}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    debug_scrape_profile()