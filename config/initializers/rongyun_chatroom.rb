require 'net/http'
require 'digest/md5'
require 'uri'
require 'net/https'
require 'json'  

PlayAuth::User.class_eval do |variable|
  field :im_token, :type => String
  after_create :get_im_token

  def make_sign_str(hash)
    Digest::MD5.hexdigest(hash.sort_by{|k,v| k}.map{|k,v| k.to_s + v.to_s}.join())
  end
  
  def get_im_token
    #发送http请求获得token并存入im_token字段中
    app_secret = "AjJmAbrO35"
    nonce = rand(99999)
    timestamp = Time.now
    array = [app_secret,nonce,timestamp]
    signature = Digest::SHA1.hexdigest(array.join)
    params = {
      :userId => self.id,
      :name => self.name,
      :portraitUri => self.image
    }
    params[:sign] = make_sign_str(params)
    url = URI.parse("http://api.cn.ronghub.com/user/getToken.json")
    Net::HTTP.start(url.host, url.port) do |http|
      req = Net::HTTP::Post.new(url.path)
      req['App-Key'] = "z3v5yqkbvvpl0"
      req['Nonce'] = nonce
      req['Timestamp'] = timestamp
      req['Signature'] = signature
      req['Content-Type'] = 'application/x-www-form-urlencoded'
      req['Content-Length'] = 78 
      req.set_form_data(params)
      self.im_token = JSON.parse(http.request(req).body)['token']
    end
  end
end