## React-Polling-Manager

#### Why

Image you face the situation:

fetch an interface, the response includes items which have unready status, developer have to filter them and then polling to fetch the items's final status.

But, the question is that:

1. What if it's a pagination situation? After trigger an paging action, the developer have to release all the resources including timer or on the way fetching.

2. What if the developer have some actions, so they have to stop all the polling actions?

#### How

> BASE ON* *[*Observer pattern*]**(*https://en.wikipedia.org/wiki/Observer_pattern*)*

1. Create an Manager, it's task is to manage all the polling tasks;

2. if any polling task is done (satisfied `done` condition), notify the developer;

3. if any polling task is fail, retry polling until reach `retryLimit`, then nofity the developer;

4. if accept stop action, clear resources.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gtqkjxyudqj60ce0djwez02.jpg" alt="polling-manager-design" style="zoom:67%;" />


#### Design