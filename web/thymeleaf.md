# form

- 后端

  ```java
  @RequestMapping(value = "/add", method=RequestMethod.POST)  
  public String save(@ModelAttribute(value="message") Message message) {  }
  ```

- html

  - @{/add}: 会解析成 /${path}/add

  ```html
  <form th:action="@{/add}" th:object="${message}" method="post">
     <input type="text" th:field="*{info}" />
  </form>
  ```

# js

- 获取request 值

  ```js
  var xx = "[[${session.xx}]]"; // 获取session中的值
  var yy = "[[${yy}]]"; // 获取model中的值
  ```

  