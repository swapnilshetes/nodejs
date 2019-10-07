import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
from dicttoxml import dicttoxml
from xml.dom.minidom import parseString

class FacebookScrap():
    DRIVER_EXE_PATH = "C:\System_bk\python-poc\chromedriver.exe"
    PAGE_URL = "https://www.facebook.com"
    credential_username = ""
    credential_password = ""
    user_data = {}
    def __init__(self, driver= None):
        self.driver = webdriver.Chrome(executable_path=self.DRIVER_EXE_PATH)

    def create_xml(self , obj , descFullPath) :
        xml = dicttoxml(obj, custom_root='Scrapedata', attr_type=False)
        f= open(descFullPath + "facebook-web-scraping.xml","a+");
        print(xml)
        f.write(str(xml))
        f.close()
        return 1

    def loginToFacebook(self): 
        loginpath = "/login.php"
        # txtFName = browser.find_element(By.XPATH('//*[@id="name_3_firstname"]'))
        browser = self.driver
        browser.get(self.PAGE_URL + loginpath)
        browser.maximize_window()
        #print("1")
        facebook_eles = browser.find_elements_by_xpath('//input[@class="inputtext _55r1 inputtext _1kbt inputtext _1kbt"]')
        
        facebook_eles[0].send_keys(self.credential_username)
        #print("3")
        time.sleep(1)
        #facebook_eles[0].send_keys(Keys.RETURN)
        
        facebook_eles[1].send_keys(self.credential_password)
        time.sleep(2)
       
        #print("4")
        #if confirmNextPagePwd_yahoo == "Hello, swapnill_shete@yahoo.co.in"
        #WebDriverWait(self.driver, 10).until(EC.staleness_of(btnNext_yahoo))
        
        btnlogin_facebook = browser.find_element_by_xpath('//button[@class="_42ft _4jy0 _52e0 _4jy6 _4jy1 selected _51sy"]')
        btnlogin_facebook.click()
   
    def facebookSearch(self) :
        searchPath = "/search/people/?q=swapnil shete&epa=SERP_TAB"
        self.driver.get(self.PAGE_URL + searchPath )
        a_list_users = self.driver.find_elements_by_css_selector("a._32mo")
        #print(a_list_users)
        
        # extract details page 
        for x in range(7) : 
            self.driver.implicitly_wait(5)
            time.sleep(2)
            print(x)
            print(a_list_users[x].get_attribute("href"))

            #self.driver.get(a_list_users[x].get_attribute("href").url)
            time.sleep(10)
            
        #self.create_xml(self.user_data , "C:\\System_bk\\python-poc\\xml\\")



    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    tw = FacebookScrap()
    tw.loginToFacebook()
    tw.facebookSearch()
    #tw.tearDown()
