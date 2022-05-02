//
//  ContentView.swift
//  half
//
//  Created by 정충효 on 2022/04/25.
//

import SwiftUI

struct Home: View{
   
    @State var showSheet: Bool = false //알람
    @State var showSheet1: Bool = false // 성별
    @State var showSheet2: Bool = false // 일일활동
    @State var showSheet3: Bool = false // 날씨
    @State var showSheet4: Bool = false // 체중
    @State var weight = 0 // 체중
    @State var gen = 0 // 성별
    @Binding var chan : Int // 일일활동
    @Binding var wea : Int  // 날씨
    @Binding var test : Int // 체중 받아오는거
   var wei = [Int](0..<90)
    var body: some View{
        VStack{

            ZStack{
                VStack(spacing: 6)
                {
                    Text("오늘의 물 섭취량")
                        .font(.largeTitle)
                        .padding(.bottom, 40)
                        .padding(.trailing, 20)
                 
                    HStack{
                        Text("성별")
                        
                        Spacer(minLength: 15)
                        if gen == 0{
                            Text("남성")
                        }
                        else {
                            Text("여성")
                        }
                    Button{
                        showSheet1.toggle()
                    } label: {
                        Image(systemName: "chevron.right")
                        .padding()
                        .foregroundColor(Color.blue.opacity(0.5))
                        .font(.system(size: 22))
                        
                    }
                    .halfSheet1(showSheet1: $showSheet1){
                        VStack{
                            Button(action: {
                                showSheet1.toggle()
                                self.gen = 0
                            }, label: {
                            
                                Text("남성")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 100.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                            
                        Button(action: {
                            showSheet1.toggle()
                            self.gen = 1
                        }, label: {
                            
                                Text("여성")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 100.0)
                        .background(Color.blue)
                        .cornerRadius(10)

                        }
                    }
                    onEnd1: {
                        print("")
                    }
                }
                    .padding(.horizontal, 34)
                    .border(Color(red: 0.776, green: 0.776, blue: 0.772),width: 1)
                    .frame(width: 400 )
                    
                    HStack{
                        Text("체중")
                        
                        Spacer(minLength: 15)
                       Text("\(test + 30) Kg")
                    Button{
                        showSheet4.toggle()
                    } label: {
                        Image(systemName: "chevron.right")
                        .padding()
                        .foregroundColor(Color.blue.opacity(0.5))
                        .font(.system(size: 22))
                        
                    }
                    .halfSheet4(showSheet4: $showSheet4){
                        VStack{
                            HStack{
                            GeometryReader{ geometry in
                                Picker(selection: self.$weight, label: Text(""), content: {
                                    ForEach(0..<self.wei.count){ index in
                                        Text("\(wei[index] + 30)")
                                            .font(.system(size: 22))
                                            .fontWeight(.bold)
                                            .foregroundColor(.blue)
                                    }
                                }).pickerStyle(.wheel)
                                    
                                    .frame(width: 40, height: 100)
                                    .clipped()
                                    .compositingGroup()
                                    .offset(x: 151 ,y: 100)
                                Button(action: {
                                    showSheet4.toggle()
                                    self.test = weight
                                    
                                }, label: {
                                
                                    Text("완료")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                
                            })
                            .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                            .frame(width: 100.0)
                            .background(Color.blue)
                            .cornerRadius(10)
                            .offset(x:125, y: 220)
                                 
                                Text("Kg")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    .padding()
                                    .foregroundColor(.blue)
                                    
                                    .offset(x: 190,y: 120)
                            }
                            
                            }
                                       }
                        .padding()
    
                    }
                    onEnd4: {
                        print("")
                    }
                }
                    .padding(.horizontal, 34)
                    .border(Color(red: 0.776, green: 0.776, blue: 0.772),width: 1)
                    .frame(width: 400 )
                    
                    HStack{
                        Text("일일 활동")
                        
                        Spacer(minLength: 15)
                        if self.chan == -300 {
                            Text("낮음")
                        }
                        else if self.chan == 0 {
                            Text("중간")
                        }
                        else if self.chan == 400 {
                            Text("활동적")
                        }
                        
                    Button{
                        showSheet2.toggle()
                    } label: {
                        Image(systemName: "chevron.right")
                        .padding()
                        .foregroundColor(Color.blue.opacity(0.5))
                        .font(.system(size: 22))
                        
                    }
                    .halfSheet2(showSheet2: $showSheet2){
                        VStack{
                            HStack{
                                Text("활동적")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                Spacer()
                        Button(action: {
                            showSheet2.toggle()
                            self.chan = 400
                        
                            
                        }, label: {
                            
                                Text("+ 400ml")
                            
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                        }
                            .frame(width: 250)
                            
                            HStack{
                                Text("중간")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    
                                Spacer()
                                
                        Button(action: {
                            showSheet2.toggle()
                            self.chan = 0
                        }, label: {
                            
                                Text("+ 0ml")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(.all, 9.0)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                        }
                            .frame(width: 250)
                           
                            HStack{
                                Text("낮음")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    
                                Spacer()
                                
                        Button(action: {
                            showSheet2.toggle()
                            self.chan = -300
                            
                        }, label: {
                            
                                Text("- 300ml")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                               
                        }
                            .frame(width: 250)
                        }
                    }
                    onEnd2: {
                        print("")
                    }
                    }
                    .padding(.horizontal, 34)
                    .border(Color(red: 0.776, green: 0.776, blue: 0.772),width: 1)
                    .frame(width: 400 )
                    HStack{
                        Text("날씨")
                        
                        Spacer(minLength: 15)
                        if self.wea == 500 {
                            Text("더움")
                        }
                        else if self.wea == 250 {
                            Text("따뜻함")
                        }
                        else if self.wea == 0 {
                            Text("선선함")
                        }
                        else if self.wea == -200 {
                            Text("추움")
                        }
                    Button{
                        showSheet3.toggle()
                    } label: {
                        Image(systemName: "chevron.right")
                        .padding()
                        .foregroundColor(Color.blue.opacity(0.5))
                        .font(.system(size: 22))
                        
                    }
                    .halfSheet3(showSheet3: $showSheet3){
                        VStack{
                            HStack{
                                Text("더움")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    
                                Spacer()
                                
                        Button(action: {
                            showSheet3.toggle()
                            self.wea = 500
                            
                            
                        }, label: {
                            
                                Text("+ 500ml")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                        }
                            .frame(width: 250)
                            
                            HStack{
                                Text("따뜻함")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    
                                Spacer()
                        Button(action: {
                            showSheet3.toggle()
                            self.wea = 250
                           
                        }, label: {
                            
                                Text("+ 250ml")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(.all, 9.0)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                        }
                            .frame(width: 250)
                            HStack{
                                Text("선선함")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                Spacer()
                        Button(action: {
                            showSheet3.toggle()
                            self.wea = 0
                          
                        }, label: {
                            
                                Text("+ 0ml")
                            
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                        }
                            .frame(width: 250)
                            HStack{
                                Text("추움")
                                    .font(.system(size: 22))
                                    .fontWeight(.bold)
                                    
                                Spacer()
                                
                        Button(action: {
                            showSheet3.toggle()
                            self.wea = -200
                        
                        }, label: {
                            
                                Text("- 200ml")
                                .font(.system(size: 22))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                        })
                        .padding(/*@START_MENU_TOKEN@*/.all, 9.0/*@END_MENU_TOKEN@*/)
                        .frame(width: 110.0)
                        .background(Color.blue)
                        .cornerRadius(10)
                        }
                            .frame(width: 250)
                        }
                    }
                    onEnd3: {
                        print("")
                    }
                       
                    }
                    .padding(.horizontal, 34)
                    .border(Color(red: 0.776, green: 0.776, blue: 0.772),width: 1)
                    .frame(width: 400 )
                    
                    VStack{
                        Text("일일 섭취량")
                        Spacer(minLength: 15)
                        Text("\((test + 30) * 30 + (chan + wea)) ml")
                     
                    
                    }
                    .offset(x:-10 ,y: 90)
                    
                }
                .offset(x: 10,y: -100)
                .frame(width: 350, height: 300, alignment: .center)
            }
            
        }
        
    }
}

extension View{
    func halfSheet<SheetView: View>(showSheet: Binding<Bool>,@ViewBuilder sheetView: @escaping ()->SheetView, onEnd: @escaping ()->())-> some View{
        return self
            .background(
                HalfSheetHelper(sheetView: sheetView(),showSheet: showSheet,
                                onEnd:onEnd)
            )
    }
   
    func halfSheet1<SheetView: View>(showSheet1: Binding<Bool>,@ViewBuilder sheetView1: @escaping ()->SheetView, onEnd1: @escaping ()->())-> some View{
        return self
            .background(
                HalfSheetHelper1(sheetView1: sheetView1(),showSheet1: showSheet1,onEnd1:onEnd1)
            )
    }
    func halfSheet2<SheetView: View>(showSheet2: Binding<Bool>,@ViewBuilder sheetView2: @escaping ()->SheetView, onEnd2: @escaping ()->())-> some View{
        return self
            .background(
                HalfSheetHelper2(sheetView2: sheetView2(),showSheet2: showSheet2,onEnd2:onEnd2)
            )
    }
    func halfSheet3<SheetView: View>(showSheet3: Binding<Bool>,@ViewBuilder sheetView3: @escaping ()->SheetView, onEnd3: @escaping ()->())-> some View{
        return self
            .background(
                HalfSheetHelper3(sheetView3: sheetView3(),showSheet3: showSheet3,onEnd3:onEnd3)
            )
    }
    func halfSheet4<SheetView: View>(showSheet4: Binding<Bool>,@ViewBuilder sheetView4: @escaping ()->SheetView, onEnd4: @escaping ()->())-> some View{
        return self
            .background(
                HalfSheetHelper4(sheetView4: sheetView4(),showSheet4: showSheet4,onEnd4:onEnd4)
            )
    }
    func halfSheet5<SheetView: View>(showSheet5: Binding<Bool>,@ViewBuilder sheetView5: @escaping ()->SheetView, onEnd5: @escaping ()->())-> some View{
        return self
            .background(
                HalfSheetHelper5(sheetView5: sheetView5(),showSheet5: showSheet5,onEnd5:onEnd5)
            )
    }
   
}


//음 고민
struct HalfSheetHelper<SheetView: View>: UIViewControllerRepresentable{
    
    var sheetView: SheetView
    @Binding var showSheet: Bool
    var onEnd: ()->()
    let controller = UIViewController()
    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }
    func makeUIViewController(context: Context) -> UIViewController {
        controller.view.backgroundColor = .clear
        
        return controller
    }
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        if showSheet{
            
            let sheetController = CustomHostingController(rootView: sheetView)
            sheetController.presentationController?.delegate = context.coordinator
            uiViewController.present(sheetController, animated: true)
    }
        else{
            uiViewController.dismiss(animated: true)
        }
}
    class Coordinator: NSObject,UISheetPresentationControllerDelegate{
        var parent: HalfSheetHelper
        init(parent: HalfSheetHelper){
            self.parent = parent
        }
        func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
            parent.showSheet = false
            parent.onEnd()
            
        }
        
    }
}
class CustomHostingController<Content: View>: UIHostingController<Content>{

   override func viewDidLoad() {
       view.backgroundColor = .white
       
        if let presentationController = presentationController as?
            UISheetPresentationController{
            presentationController.detents = [.large()]
            presentationController.prefersGrabberVisible = true
        }
    }
}
//성별
struct HalfSheetHelper1<SheetView: View>: UIViewControllerRepresentable{
    
    var sheetView1: SheetView
    @Binding var showSheet1: Bool
    var onEnd1: ()->()
    let controller1 = UIViewController()
    func makeCoordinator() -> Coordinator1 {
        return Coordinator1(parent1: self)
    }
    func makeUIViewController(context: Context) -> UIViewController {
        controller1.view.backgroundColor = .clear
        
        return controller1
    }
    func updateUIViewController(_ uiViewController1: UIViewController, context: Context) {
        if showSheet1{
            let sheetController1 = CustomHostingController1(rootView: sheetView1)
            sheetController1.presentationController?.delegate = context.coordinator
            uiViewController1.present(sheetController1, animated: true)
    }
        else{
            uiViewController1.dismiss(animated: true)
        }
}
    class Coordinator1: NSObject,UISheetPresentationControllerDelegate{
        var parent1: HalfSheetHelper1
        init(parent1: HalfSheetHelper1){
            self.parent1 = parent1
        }
        func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
            parent1.showSheet1 = false
            parent1.onEnd1()
            
        }
    }
}
class CustomHostingController1<Content: View>: UIHostingController<Content>{

   override func viewDidLoad() {
       view.backgroundColor = .white
       
       
        if let presentationController1 = presentationController as?
            UISheetPresentationController{
            presentationController1.detents = [
            
                .medium(), .large()]
            presentationController1.prefersGrabberVisible = true
        }
    }
}
//일일
struct HalfSheetHelper2<SheetView: View>: UIViewControllerRepresentable{
    
    var sheetView2: SheetView
    @Binding var showSheet2: Bool
    var onEnd2: ()->()
    let controller2 = UIViewController()
    func makeCoordinator() -> Coordinator2 {
        return Coordinator2(parent2: self)
    }
    func makeUIViewController(context: Context) -> UIViewController {
        controller2.view.backgroundColor = .clear
        
        return controller2
    }
    func updateUIViewController(_ uiViewController2: UIViewController, context: Context) {
        if showSheet2{
            
            let sheetController2 = CustomHostingController1(rootView: sheetView2)
            sheetController2.presentationController?.delegate = context.coordinator
            uiViewController2.present(sheetController2, animated: true)
    }
        else{
            uiViewController2.dismiss(animated: true)
        }
}
    class Coordinator2: NSObject,UISheetPresentationControllerDelegate{
        var parent2: HalfSheetHelper2
        init(parent2: HalfSheetHelper2){
            self.parent2 = parent2
        }
        func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
            parent2.showSheet2 = false
            parent2.onEnd2()
            
        }
    }
}
class CustomHostingController2<Content: View>: UIHostingController<Content>{

   override func viewDidLoad() {
       view.backgroundColor = .white
       
       
        if let presentationController2 = presentationController as?
            UISheetPresentationController{
            presentationController2.detents = [
            
                .medium(), .large()]
            presentationController2.prefersGrabberVisible = true
        }
    }
}
//날씨
 struct HalfSheetHelper3<SheetView: View>: UIViewControllerRepresentable{
     
     var sheetView3: SheetView
     @Binding var showSheet3: Bool
     var onEnd3: ()->()
     let controller3 = UIViewController()
     func makeCoordinator() -> Coordinator3 {
         return Coordinator3(parent3: self)
     }
     func makeUIViewController(context: Context) -> UIViewController {
         controller3.view.backgroundColor = .clear
         
         return controller3
     }
     func updateUIViewController(_ uiViewController3: UIViewController, context: Context) {
         if showSheet3{
             
             let sheetController3 = CustomHostingController1(rootView: sheetView3)
             sheetController3.presentationController?.delegate = context.coordinator
             uiViewController3.present(sheetController3, animated: true)
     }
         else{
             uiViewController3.dismiss(animated: true)
         }
 }
     class Coordinator3: NSObject,UISheetPresentationControllerDelegate{
         var parent3: HalfSheetHelper3
         init(parent3: HalfSheetHelper3){
             self.parent3 = parent3
         }
         func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
             parent3.showSheet3 = false
             parent3.onEnd3()
             
         }
     }
 }
 class CustomHostingController3<Content: View>: UIHostingController<Content>{

    override func viewDidLoad() {
        view.backgroundColor = .white
        
        
         if let presentationController3 = presentationController as?
             UISheetPresentationController{
             presentationController3.detents = [
             
                 .medium(), .large()]
             presentationController3.prefersGrabberVisible = true
         }
     }
 }
//체중
struct HalfSheetHelper4<SheetView: View>: UIViewControllerRepresentable{
    
    var sheetView4: SheetView
    @Binding var showSheet4: Bool
    var onEnd4: ()->()
    let controller4 = UIViewController()
    func makeCoordinator() -> Coordinator4 {
        return Coordinator4(parent4: self)
    }
    func makeUIViewController(context: Context) -> UIViewController {
        controller4.view.backgroundColor = .clear
        
        return controller4
    }
    func updateUIViewController(_ uiViewController4: UIViewController, context: Context) {
        if showSheet4{
            
            let sheetController4 = CustomHostingController1(rootView: sheetView4)
            sheetController4.presentationController?.delegate = context.coordinator
            uiViewController4.present(sheetController4, animated: true)
    }
        else{
            uiViewController4.dismiss(animated: true)
        }
}
    class Coordinator4: NSObject,UISheetPresentationControllerDelegate{
        var parent4: HalfSheetHelper4
        init(parent4: HalfSheetHelper4){
            self.parent4 = parent4
        }
        func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
            parent4.showSheet4 = false
            parent4.onEnd4()
            
        }
    }
}
class CustomHostingController4<Content: View>: UIHostingController<Content>{

   override func viewDidLoad() {
       view.backgroundColor = .white
       
       
        if let presentationController4 = presentationController as?
            UISheetPresentationController{
            presentationController4.detents = [
            
                .medium(), .large()]
            presentationController4.prefersGrabberVisible = true
        }
    }
}
struct HalfSheetHelper5<SheetView: View>: UIViewControllerRepresentable{
    
    var sheetView5: SheetView
    @Binding var showSheet5: Bool
    var onEnd5: ()->()
    let controller5 = UIViewController()
    func makeCoordinator() -> Coordinator5 {
        return Coordinator5(parent5: self)
    }
    func makeUIViewController(context: Context) -> UIViewController {
        controller5.view.backgroundColor = .clear
        
        return controller5
    }
    func updateUIViewController(_ uiViewController5: UIViewController, context: Context) {
        if showSheet5{
            let sheetController5 = CustomHostingController5(rootView: sheetView5)
            sheetController5.presentationController?.delegate = context.coordinator
            uiViewController5.present(sheetController5, animated: true)
    }
        else{
            uiViewController5.dismiss(animated: true)
        }
}
    class Coordinator5: NSObject,UISheetPresentationControllerDelegate{
        var parent5: HalfSheetHelper5
        init(parent5: HalfSheetHelper5){
            self.parent5 = parent5
        }
        func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
            parent5.showSheet5 = false
            parent5.onEnd5()
            
        }
    }
}
class CustomHostingController5<Content: View>: UIHostingController<Content>{

   override func viewDidLoad() {
       view.backgroundColor = .white
       
       
        if let presentationController5 = presentationController as?
            UISheetPresentationController{
            presentationController5.detents = [
            
                .medium(), .large()]
            presentationController5.prefersGrabberVisible = true
        }
    }
}


