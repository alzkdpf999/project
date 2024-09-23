//package com.example.demo.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.dto.UserDto;
//import com.example.demo.service.UserService;
//
//@RestController
//public class UserController{
//
//    private final UserService userService;
//    @Autowired
//    public UserController(UserService userService) {
//        this.userService = userService;
//    }
//
//    @GetMapping("/join")
//    public String joinPage(){
//        return "joinPage";
//    }
//    @PostMapping("/join")
//    public String joinAction(UserDto userDto){
//        userService.join(userDto);
//        return "redirect:/login";
//    }
//    @GetMapping("/login")
//    public String loginAction(){
//        return "loginPage";
//    }
//    // @PostMapping("/login")
//    // public String loginAction(HttpServletRequest request, UserDto userDto){
//    //     UserEntity user = userService.login(userDto);
//    //     if(user == null){
//    //         return "/redirect:/login";
//    //     }
//    //     return "redirect:/";
//    // }
//    // @GetMapping("/logout")
//    // public String logout(HttpServletRequest request){
//    //     HttpSession session = request.getSession();
//    //     if(session != null){
//    //         session.invalidate();
//    //     }
//    //     return "redirect:/";
//    // }
//}
