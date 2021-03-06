//
//  setting.swift
//  testvar
//
//  Created by 정충효 on 2022/04/28.
//

import SwiftUI
import UserNotifications
import DLLocalNotifications

struct tap:View {
//    @Binding var but : Bool
    @State var but = false
    @State var chan : Int = 0 // 일일활동
    @State var wea : Int = 0 // 날씨
    @State var test : Int = 0// 체중 받아오는거
    @State var re = 0
    @State var startDay = Date()
    @State var endDay = Date()
    var timevalue = ["30분", "1시간","1시간 30분", "2시간"]
    var time: DateFormatter {
        let timematter = DateFormatter()
        timematter.dateFormat = "HH:mm"
        return timematter
    }
    func setnotifi() -> Void{
        let manager = gogogo()
        manager.requestPermission()
        manager.RepeatingNotification(start: startDay, end: endDay, re: (re + 1) * 30 * 60)
    }

    var body: some View{

        NavigationView{
            VStack{
                Toggle(isOn: $but){
                Text("알림 on / off")
                        .font(.title)
            }
                .padding(.horizontal, 4)
                .frame(width: 300, height: 100)

                if but{

                    NavigationLink(destination: dma(re:$re,startDay: $startDay, endDay: $endDay))
                    {
                        VStack{
                            Text("반복시간:\(timevalue[re])")
                Text("알람: \(time.string(from: startDay)) ~ \(time.string(from: endDay))")
                        }.font(.system(size: 19))
                        .foregroundColor(.black)
                    .frame(width: 350, height: 90)

                    .border(Color(red: 0.776, green: 0.776, blue: 0.772),width: 1)
                    .background(Color(red: 0.573, green: 0.753, blue: 0.843))
                    .cornerRadius(20)

            }
            .padding(.vertical , 35)
            .frame(height: 33)
            .onAppear(){
                self.setnotifi()
            }
            .onDisappear(){
                UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
            }

                }
                NavigationLink(destination: Home(chan: $chan, wea: $wea, test: $test)){

                    VStack(alignment: .leading, spacing: 10){
                        Text("\((test + 30) * 30 + wea + chan)  ml")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.black)

                        Text("하루 물 섭취량을 설정해주세요")
                            .foregroundColor(.black)
                            .multilineTextAlignment(.leading)
                    }
                        .frame(width: 350, height: 120)
                        .background(Color(red: 0.573, green: 0.753, blue: 0.843))
                        .cornerRadius(20)

                }.offset(y:30)
            }
            .offset(y: -200)
            .background(
                ZStack{
                VStack{
                    Circle()
                        .fill(Color(red: 0.651, green: 0.792, blue: 0.886))
                        .scaleEffect(5)
                        .offset(y: -300)
                    Circle()
                        .fill(Color(red: 0.518, green: 0.714, blue: 0.843))
                        .scaleEffect(5.5)
                        .offset(y: -540)
                }
                }
            )

        }


}
}
struct tap_Previews: PreviewProvider {
    static var previews: some View {
       tap()
     // dma()
        //togl()
    }
}
struct dma : View{
//    @State var re = 0
    @State var but = false
//    @State var startDay = Date()
//    @State var endDay = Date()
    @Binding var re : Int
    @Binding var startDay : Date
    @Binding var endDay : Date

    var retime = ["30분", "1시간","1시간 30분", "2시간"]
    var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter
    }
    var body: some View{

        VStack{
            Section(header: Text("반복 시간 : \(retime[re])").font(.title2)){
        Picker(selection: $re, label: Text("")){
            Text("30분").tag(0)

            Text("1시간").tag(1)

            Text("1시간30분").tag(2)

            Text("2시간").tag(3)

        }

        .pickerStyle(.segmented)
        .frame(width: 360)
        .clipped()
        .compositingGroup()
        .background(Color(red: 0.573, green: 0.753, blue: 0.843))
        }
        .padding(.bottom ,40)
        Section(header: Text(" 시작시간: \(dateFormatter.string(from: startDay)) | 종료시간: \(dateFormatter.string(from: endDay))  ")
            .font(.title2)
            .frame(width: 390, height: 90)) {
                        DatePicker("시작 시간", selection: $startDay, displayedComponents: .hourAndMinute)
                    .font(.system(size: 30))
                    .frame(width: 330, height: 100)
                    .padding(.horizontal, 25)
                        DatePicker("종료 시간", selection: $endDay, displayedComponents: .hourAndMinute)
                    .font(.system(size: 30))
                    .frame(width: 330, height: 100)
                    .padding(.horizontal, 25)

            }
            .background(Color(red: 0.573, green: 0.753, blue: 0.843))
            .cornerRadius(10)
            .padding(.top, 40)

        }
        .offset(y: -70)
        .background(
            ZStack{
            VStack{
                Circle()
                    .fill(Color(red: 0.651, green: 0.792, blue: 0.886))
                    .scaleEffect(2)
                    .offset(y: -230)
                Circle()
                    .fill(Color(red: 0.518, green: 0.714, blue: 0.843))
                    .scaleEffect(2.5)
                    .offset(y: -700)
            }
            }
        )


}
}

//알람 일단 1분마다
class gogogo{

func requestPermission() -> Void{
    UNUserNotificationCenter
        .current().requestAuthorization(options: [.alert,.badge,.alert] ){
            granted, error in
            if granted == true && error == nil{
                print(granted)
            }
            print(granted)
        }
}
    func RepeatingNotification(start:Date , end:Date, re: Int){
    let scheduler = DLNotificationScheduler()
        scheduler.repeatsFromToDate(identifier: "test", alertTitle: "title", alertBody: "body", fromDate: start, toDate: end, interval: Double(re), repeats: .none)
    scheduler.scheduleAllNotifications()
}
}
