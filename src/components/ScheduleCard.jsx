import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const ScheduleCard = ({ schedules }) => {

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Weekly Schedule
            </h3>
            <div className="grid gap-3">
                {schedules.map((schedule) => (
                    <motion.div
                        key={schedule.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
                    >
                        <span className="font-medium text-gray-700">{schedule.day}</span>
                        <span className="text-blue-600 font-semibold flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {schedule.time}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleCard;